export default function (plop) {
  // controller generator
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'controller name please',
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
}
