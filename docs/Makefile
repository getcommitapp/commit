SHELL := /bin/bash

# Use Dockerized pandoc when DOCKER=1, otherwise use system pandoc
DOCKER ?= 0
ifeq ($(DOCKER),1)
PANDOC := docker run --rm -v $(shell pwd):/data pandoc/extra:latest
PLANTUML := docker run --rm -e PLANTUML_LIMIT_SIZE=8192 -v $(shell pwd):/data plantuml/plantuml:latest
else
PANDOC := pandoc
PLANTUML := plantuml
endif

# Inputs/outputs
SRC := software-requirements-specification.md
OUT := software-requirements-specification.pdf

# All files in assets directory (if present) are dependencies
ASSETS := $(shell if [ -d assets ]; then find assets -type f; fi)

# PlantUML diagram generation (SVG only)
PUML_SRC := db-schema.puml
PUML_SVG := db-schema.svg
PUML_PNG := db-schema.png

.PHONY: all clean db

all: $(OUT)

$(OUT): $(SRC) $(ASSETS) Makefile
	$(PANDOC) --pdf-engine=xelatex $(SRC) -o $(OUT)

db: $(PUML_SVG) $(PUML_PNG)

$(PUML_SVG): $(PUML_SRC) Makefile
	$(PLANTUML) -tsvg $(PUML_SRC) -o .

$(PUML_PNG): $(PUML_SRC) Makefile
	PLANTUML_LIMIT_SIZE=8192 $(PLANTUML) -tpng $(PUML_SRC) -o .

clean:
	rm -f $(OUT) $(PUML_SVG) $(PUML_PNG)

