export default function (plop) {
  // controller generator
  plop.setGenerator('table', {
    description: 'table page generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'table name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'docs/generated/{{name}}.md',
        templateFile: 'plop-templates/controller.hbs.md',
      },
    ],
  });

  plop.setGenerator('sidebar', {
    description: 'sidebar generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'table name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'docs/generated/_sidebar.md',
        template: '{{list}}',
      },
    ],
  });
}
