package main

import (
	"html/template"
	"net/http"
	"strings"

	"github.com/Masterminds/sprig/v3"
	"github.com/crowdsecurity/crowdsec/pkg/models"
	"github.com/gin-gonic/gin"
)

var (
	sprigFuncs            template.FuncMap
	blacklistedSprigFuncs = []string{"env", "expandenv"}
)

type FormatRequest struct {
	FormatString string         `json:"formatString"`
	Alerts       []models.Alert `json:"alerts"`
}

func format(c *gin.Context) {
	var Request FormatRequest
	if err := c.ShouldBindJSON(&Request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	template, _ := template.New("").Funcs(sprigFuncs).Parse(Request.FormatString)
	b := new(strings.Builder)
	template.Execute(b, Request.Alerts)
	c.String(http.StatusOK, b.String())
}

func scaffoldSpringFuncs() {
	bsf := sprig.TxtFuncMap()
	for _, v := range blacklistedSprigFuncs {
		delete(bsf, v)
	}
	sprigFuncs = bsf
}

func main() {
	r := gin.Default()
	scaffoldSpringFuncs()
	api := r.Group("/api")
	{
		v1 := api.Group("/v1")
		{
			v1.POST("/format", format)
		}
	}
	r.Run()
}
