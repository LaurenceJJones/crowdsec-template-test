package main

import (
	"encoding/json"
	"fmt"
	"text/template"
	"strings"
	"syscall/js"

	"github.com/Masterminds/sprig/v3"
	"github.com/crowdsecurity/crowdsec/pkg/models"
)

type FormatRequest struct {
	FormatString string         `json:"formatString"`
	Alerts       []models.Alert `json:"alerts"`
}

func formatWrapper() js.Func {
	formatFunc := js.FuncOf(func(this js.Value, args []js.Value) any {
		t := FormatRequest{}
		err := json.Unmarshal([]byte(args[0].String()), &t)
		if err != nil {
			fmt.Printf("unable to parse json %s\n", err)
			return err.Error()
		}
		template, err := template.New("").Funcs(sprig.TxtFuncMap()).Parse(t.FormatString)
		if err != nil {
			fmt.Printf("unable to compile template %s\n", err)
			return err.Error()
		}
		b := new(strings.Builder)
		if err = template.Execute(b, t.Alerts); err != nil {
			fmt.Printf("unable to compile template %s\n", err)
			return err.Error()
		}
		return b.String()
	})
	return formatFunc
}

func main() {
	js.Global().Set("formatWrapper", formatWrapper())
	<-make(chan bool)
}
