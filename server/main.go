package main

import (
	"fmt"
	"html/template"
	"net/http"
	"strings"

	"github.com/Masterminds/sprig/v3"
	"github.com/crowdsecurity/crowdsec/pkg/models"
	"github.com/gin-gonic/gin"
)

var (
	sprigFuncs            template.FuncMap
	blacklistedSprigFuncs = []string{"env", "expandenv", "getHostByName", "randBytes", "buildCustomCert", "genCa", "genPrivateKey", "genCAWithKey", "genSelfSignedCert", "genSelfSignedCertWithKey", "genSignedCert", "genSignedCertWithKey"}
)

type FormatRequest struct {
	FormatString string         `json:"formatString"`
	Alerts       []models.Alert `json:"alerts"`
}

func handleError(c *gin.Context) {
	c.Next()
	e := c.Errors.Last()
	if e == nil {
		return
	}
	c.String(-1, fmt.Sprintf("Error: %s", e.Error()))
}

func format(c *gin.Context) {
	var Request FormatRequest
	if err := c.BindJSON(&Request); err != nil {
		return
	}
	template, err := template.New("").Funcs(sprigFuncs).Parse(Request.FormatString)
	if err != nil {
		c.AbortWithError(400, err)
		return
	}
	b := new(strings.Builder)
	if err = template.Execute(b, Request.Alerts); err != nil {
		c.AbortWithError(400, err)
		return
	}
	c.String(http.StatusOK, b.String())
}

func scaffoldSprigFuncs() {
	bsf := sprig.TxtFuncMap()
	for _, v := range blacklistedSprigFuncs {
		delete(bsf, v)
	}
	sprigFuncs = bsf
}

func main() {
	r := gin.Default()
	r.SetTrustedProxies([]string{"127.0.0.1", "172.17.0.1"})
	scaffoldSprigFuncs()
	r.Use(handleError)
	api := r.Group("/api")
	{
		v1 := api.Group("/v1")
		{
			v1.POST("/format", format)
		}
	}
	r.Run()
}
