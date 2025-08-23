# Architecture Overview

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Schema (MCD)](#database-schema-mcd)
3. [Branch-Based CI/CD Flow](#branch-based-cicd-flow)
4. [Main Branch CI/CD Flow](#main-branch-cicd-flow)

---

## System Architecture

![System Architecture](assets/architecture.png)

System architecture showing a React Native SDK connecting to Supabase backend
with PostgreSQL database, Edge Functions, Storage, and Stripe payment
integration.

---

## Database Schema

![Database Schema](db-schema.png)

Entity-relationship diagram generated from `docs/db-schema.puml`.

---

## Branch-Based CI/CD Flow

![Branch-Based CI/CD Flow](assets/branch_based_CI_CD_flow.png)

Complete CI/CD workflow diagram showing how feature branches, pull requests,
and main branch interactions trigger different automated processes.

---

## Main Branch CI/CD Flow

![Main Branch CI/CD Flow](assets/main_branch_CI_CD_flow.png)

Detailed sequence diagram focusing specifically on the CI/CD actions triggered
when changes are merged to the main branch.
