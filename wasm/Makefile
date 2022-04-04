NAME = jsondiff.wasm

.PHONY: build
build:
	go mod tidy
	GOOS=js GOARCH=wasm go build -o $(NAME)

.PHONY: clean
clean:
	go clean
	rm -f $(NAME)
