import { Component, ViewChild } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import {
  MonacoEditorComponent,
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService,
  MonacoStandaloneCodeEditor,
} from '@materia-ui/ngx-monaco-editor';

@Component({
  selector: 'my-app',
  templateUrl: `./app.component.html`,
  styleUrls: [`./app.component.css`],
})
export class AppComponent {
  @ViewChild(MonacoEditorComponent, { static: false })
  monacoComponent: MonacoEditorComponent;
  editorOptions: MonacoEditorConstructionOptions = {
    theme: 'vs',
    language: 'yaml',
    minimap: {
      enabled: false,
    },
    lineNumbers: 'on',
    automaticLayout: true,
  };
  code = this.getCode();
  model: any;

  constructor(private monacoLoaderService: MonacoEditorLoaderService) {
    this.monacoLoaderService.isMonacoLoaded$
      .pipe(
        filter((isLoaded) => isLoaded),
        take(1)
      )
      .subscribe(() => {
        console.log('loaded');
        // this.model = monaco.editor.createModel(jsonCode, "json", modelUri);
        /* monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          enableSchemaRequest: true,
          validate: true,
          schemas: [
            {
              // fileMatch: ['foo.json'], // associate with our model
              schema: {
                type: 'object',
                properties: {
                  scopes: {
                    description: 'something useful here',
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        include: {
                          type: 'array',
                          items: [
                            {
                              type: 'string',
                            },
                          ],
                        },
                        exclude: {
                          type: 'array',
                          items: [
                            {
                              type: 'string',
                            },
                          ],
                        },
                        asset_types: {
                          type: 'array',
                          items: [
                            {
                              type: 'string',
                            },
                          ],
                        },
                      },
                      required: ['include'],
                    },
                  },
                },
                required: ['scopes'],
              },
            } as any,
          ],
        });
      */
      });
  }
  save() {
    let line = this.code;
    console.log(line);
  }
  editorInit(editor: MonacoStandaloneCodeEditor) {
    const model = monaco.editor.createModel(
      this.getCode()
      //'json',
      //monaco.Uri.parse('a://b/foo.json')
    );
    editor.setModel(model);
    console.log(this.code);
  }

  getCode() {
    return `version: 2.1

    # Define the jobs we want to run for this project
    jobs:
      build:
        docker:
          - image: cimg/<language>:<version TAG>
            auth:
              username: mydockerhub-user
              password: $DOCKERHUB_PASSWORD  # context / project UI env-var reference
        steps:
          - checkout
          - run: echo "this is the build job"
      test:
        docker:
          - image: cimg/<language>:<version TAG>
            auth:
              username: mydockerhub-user
              password: $DOCKERHUB_PASSWORD  # context / project UI env-var reference
        steps:
          - checkout
          - run: echo "this is the test job"
    
    # Orchestrate our job run sequence
    workflows:
      build_and_test:
        jobs:
          - build
          - test
    `;
  }
}
