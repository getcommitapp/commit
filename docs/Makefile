SHELL := /bin/bash

# Use Dockerized pandoc when DOCKER=1, otherwise use system pandoc
DOCKER ?= 0
ifeq ($(DOCKER),1)
PANDOC := docker run --rm -v $(shell pwd):/data pandoc/extra:latest
else
PANDOC := pandoc
endif

# Inputs/outputs
SRC := software-requirements-specification.md
OUT := software-requirements-specification.pdf

# All files in assets directory (if present) are dependencies
ASSETS := $(shell if [ -d assets ]; then find assets -type f; fi)

.PHONY: all clean

all: $(OUT)

$(OUT): $(SRC) $(ASSETS) Makefile
	$(PANDOC) --pdf-engine=xelatex $(SRC) -o $(OUT)

clean:
	rm -f $(OUT)

