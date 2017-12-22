import * as vscode from 'vscode';
import { ElasticMatch } from './ElasticMatch'



export class ElasticMatches {
    Editor: vscode.TextEditor
    Matches: ElasticMatch[]
    Selection: ElasticMatch

    public constructor(editor: vscode.TextEditor) {

        if (!editor) {
            console.error("updateDecorations(): no active text editor.");
            this.Matches = []
            return
        }
        this.Editor = editor
        this.Matches = []

        var matched = false

        for (var i = 0; i < editor.document.lineCount; i++) {
            var line = editor.document.lineAt(i)
            var trimedLine = line.text.trim()
            if (trimedLine.length == 0)
                continue

            if (matched && trimedLine.startsWith('{'))
                this.Matches[this.Matches.length - 1].HasBody = true

            matched = false

            // https://stackoverflow.com/a/1547940/1495442
            var regexp = /^(GET|POST|DELETE|PUT)\s+([A-Za-z0-9\-._~:\/#\[\]@!$&'\(\)\*+,;=`?]+$)/gim;
            var match = regexp.exec(line.text);

            if (match != null) {
                matched = true
                let em = new ElasticMatch(line, match);
                this.Matches.push(em)
            }
        }

        this.UpdateSelection()
    }

    public UpdateSelection(selection: vscode.Selection = null) {

        this.Selection = null

        if (selection == null)
            selection = this.Editor.selection

        this.Matches.forEach(element => {
            element.Selected = element.Range.contains(selection)
            if (element.Selected)
                this.Selection = element
        });

    }
}