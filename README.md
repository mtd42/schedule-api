# Open API Epsi Schedule

This is an open api made by `Mathieu Dorville` created in order to manage the epsi schedule.

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=mtd42_schedule-api&metric=ncloc)](https://sonarcloud.io/dashboard?id=mtd42_schedule-api)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=mtd42_schedule-api&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=mtd42_schedule-api)

## 1. Endpoints

### 1.1 schedule

| Method | Endpoint  | Example                             |
| ------ | --------- | ----------------------------------- |
| GET    | /schedule | /schedule?date=11/01/2020&day=lundi |

- Query parameters

| Name | Required | Type   | Example    | Format                                                       |
| ---- | -------- | ------ | ---------- | ------------------------------------------------------------ |
| date | yes      | string | 11/01/2020 | mm/dd/yyy                                                    |
| day  | no       | string | lundi      | Possible values :<br />- lundi<br />- mardi<br />- mercredi<br />- jeudi<br />- vendredi |