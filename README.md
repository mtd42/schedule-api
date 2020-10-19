# Open API Epsi Schedule

[TOC]

This is an open api made by `Mathieu Dorville` for managing his schedule

## 1. Endpoints

### 1.1 schedule

| Method | Endpoint  |
| ------ | --------- |
| GET    | /schedule |

- Query parameters

| Name | Required | Type   | Example    | Format                                                       |
| ---- | -------- | ------ | ---------- | ------------------------------------------------------------ |
| date | yes      | string | 11/01/2020 | mm/dd/yyy                                                    |
| day  | no       | string | lundi      | Possible values :<br />- lundi<br />- mardi<br />- mercredi<br />- jeudi<br />- vendredi |