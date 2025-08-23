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

# PlantUML diagram generation (PNG only)
PUML_SRC := db-schema.puml architecture.puml
DB_SCHEMA_PNG := db-schema.png
ARCH_PNG := architecture.png

.PHONY: all clean srs db arch

all: srs db arch

srs: $(OUT)

$(OUT): $(SRC) $(ASSETS) Makefile
	$(PANDOC) --pdf-engine=xelatex $(SRC) -o $(OUT)

db: $(DB_SCHEMA_PNG)

arch: $(ARCH_PNG)


$(DB_SCHEMA_PNG): db-schema.puml Makefile
	PLANTUML_LIMIT_SIZE=8192 $(PLANTUML) -tpng db-schema.puml -o .

$(ARCH_PNG): architecture.puml Makefile
	PLANTUML_LIMIT_SIZE=8192 $(PLANTUML) -tpng architecture.puml -o .

clean:
	rm -f $(OUT) $(DB_SCHEMA_PNG) $(ARCH_PNG)

