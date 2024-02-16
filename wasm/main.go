//go:build js && wasm

package main

import (
	"encoding/json"
	"syscall/js"

	"github.com/wI2L/jsondiff"
)

func main() {
	done := make(chan struct{}, 0)

	g := js.Global()
	fn := js.FuncOf(compare)
	defer fn.Release()
	g.Set("jsondiffCompare", fn)

	<-done
}

type ret struct {
	Error string
	Patch string
}

func (r ret) toJSValue() js.Value {
	return js.ValueOf(map[string]interface{}{
		"error": r.Error,
		"patch": r.Patch,
	})
}

func compare(_ js.Value, args []js.Value) interface{} {
	if len(args) != 7 {
		return ret{Error: "invalid number of arguments", Patch: ""}.toJSValue()
	}
	source := args[0].String()
	target := args[1].String()

	invertible := args[2].Bool()
	factorize := args[3].Bool()
	rationalize := args[4].Bool()
	equivalent := args[5].Bool()
	lcs := args[6].Bool()

	var opts []jsondiff.Option
	if invertible {
		opts = append(opts, jsondiff.Invertible())
	}
	if factorize {
		opts = append(opts, jsondiff.Factorize())
	}
	if rationalize && !lcs {
		opts = append(opts, jsondiff.Rationalize())
	}
	if equivalent {
		opts = append(opts, jsondiff.Equivalent())
	}
	if lcs {
		opts = append(opts, jsondiff.LCS())
	}
	patch, err := jsondiff.CompareJSON([]byte(source), []byte(target), opts...)
	if err != nil {
		return ret{Error: err.Error(), Patch: ""}.toJSValue()
	}
	b, err := json.Marshal(patch)
	if err != nil {
		return ret{Error: err.Error(), Patch: ""}.toJSValue()
	}
	return ret{Error: "", Patch: string(b)}.toJSValue()
}
