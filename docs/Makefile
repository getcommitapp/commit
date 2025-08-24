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
PUML_SRC := db-schema.puml architecture.puml ui-flow.puml cicd-flow.puml
DB_SCHEMA_PNG := db-schema.png
ARCH_PNG := architecture.png
UI_FLOW_PNG := ui-flow.png
CICD_FLOW_PNG := cicd-flow.png

.PHONY: all clean srs db arch ui cicd

all: srs db arch ui cicd

srs: $(OUT)

$(OUT): $(SRC) $(ASSETS) Makefile
	$(PANDOC) --pdf-engine=xelatex $(SRC) -o $(OUT)

db: $(DB_SCHEMA_PNG)

arch: $(ARCH_PNG)

ui: $(UI_FLOW_PNG)


$(DB_SCHEMA_PNG): db-schema.puml Makefile
	PLANTUML_LIMIT_SIZE=8192 $(PLANTUML) -tpng db-schema.puml -o .

$(ARCH_PNG): architecture.puml Makefile
	PLANTUML_LIMIT_SIZE=8192 $(PLANTUML) -tpng architecture.puml -o .

$(UI_FLOW_PNG): ui-flow.puml Makefile
	PLANTUML_LIMIT_SIZE=8192 $(PLANTUML) -tpng ui-flow.puml -o .

cicd: $(CICD_FLOW_PNG)

$(CICD_FLOW_PNG): cicd-flow.puml Makefile
	PLANTUML_LIMIT_SIZE=8192 $(PLANTUML) -tpng cicd-flow.puml -o .

clean:
	rm -f $(OUT) $(DB_SCHEMA_PNG) $(ARCH_PNG) $(UI_FLOW_PNG) $(CICD_FLOW_PNG)

