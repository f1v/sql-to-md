## {{titleCase title}}




<!-- panels:start -->
<!-- div:left-panel -->

#### Description

{{{description}}}

<!-- div:right-panel -->

```plantuml
@startuml
{{{classDiagram}}}
@enduml
```

<!-- panels:end -->

{{#if purpose}}
## Purpose
{{ purpose }}
{{/if}}

<!-- panels:start -->
<!-- div:title-panel -->

## The {{title}} object

<!-- div:left-panel -->

#### Attributes

{{#each columns}}
{{> attributeRow column=. }}
{{/each}}


<!-- div:right-panel -->

```sql
SELECT * FROM hub.{{name}};
```


```sql
SELECT * FROM hub.document WHERE documentTypeId='';
```

<!-- panels:end -->



### Constraints

{{ constraintsTable }}

### References
| name | references |
| ---- | ---------- |
{{#each references}}
{{> refTableRow ref=. }}
{{/each}}

### Is referenced by

- refBy 1
