## {{titleCase title}} <small>`{{database}}.{{name}}`</small>




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

#### Attributes

<!-- div:left-panel -->


{{#each columns}}
{{> attributeRow column=. }}
{{/each}}


<!-- div:right-panel -->

#### Code Samples

```sql
SELECT * FROM `{{database}}.{{name}}`;
```

```js
const test = () => {
    const me = 'me';
    return me;
}
```

<!-- panels:end -->

