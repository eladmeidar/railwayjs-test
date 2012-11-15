load('application');

before(loadSuggestion, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New suggestion';
    this.suggestion = new Suggestion;
    render();
});

action(function create() {
    Suggestion.create(req.body.Suggestion, function (err, suggestion) {
        if (err) {
            flash('error', 'Suggestion can not be created');
            render('new', {
                suggestion: suggestion,
                title: 'New suggestion'
            });
        } else {
            flash('info', 'Suggestion created');
            redirect(path_to.suggestions());
        }
    });
});

action(function index() {
    this.title = 'Suggestions index';
    Suggestion.all(function (err, suggestions) {
        render({
            suggestions: suggestions
        });
    });
});

action(function show() {
    this.title = 'Suggestion show';
    render();
});

action(function edit() {
    this.title = 'Suggestion edit';
    render();
});

action(function update() {
    this.suggestion.updateAttributes(body.Suggestion, function (err) {
        if (!err) {
            flash('info', 'Suggestion updated');
            redirect(path_to.suggestion(this.suggestion));
        } else {
            flash('error', 'Suggestion can not be updated');
            this.title = 'Edit suggestion details';
            console.log(err);
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.suggestion.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy suggestion');
        } else {
            flash('info', 'Suggestion successfully removed');
        }
        send("'" + path_to.suggestions() + "'");
    });
});

function loadSuggestion() {
    Suggestion.find(params.id, function (err, suggestion) {
        if (err || !suggestion) {
            redirect(path_to.suggestions());
        } else {
            this.suggestion = suggestion;
            console.log(this.suggestion);
            next();
        }
    }.bind(this));
}
