require('../test_helper.js').controller('suggestions', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        content: '',
        status: '',
        user_id: ''
    };
}

exports['suggestions controller'] = {

    'GET new': function (test) {
        test.get('/suggestions/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/suggestions', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Suggestion.find;
        Suggestion.find = sinon.spy(function (id, callback) {
            callback(null, new Suggestion);
        });
        test.get('/suggestions/42/edit', function () {
            test.ok(Suggestion.find.calledWith('42'));
            Suggestion.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Suggestion.find;
        Suggestion.find = sinon.spy(function (id, callback) {
            callback(null, new Suggestion);
        });
        test.get('/suggestions/42', function (req, res) {
            test.ok(Suggestion.find.calledWith('42'));
            Suggestion.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var suggestion = new ValidAttributes;
        var create = Suggestion.create;
        Suggestion.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, suggestion);
            callback(null, suggestion);
        });
        test.post('/suggestions', {Suggestion: suggestion}, function () {
            test.redirect('/suggestions');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var suggestion = new ValidAttributes;
        var create = Suggestion.create;
        Suggestion.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, suggestion);
            callback(new Error, suggestion);
        });
        test.post('/suggestions', {Suggestion: suggestion}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Suggestion.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/suggestions/1', new ValidAttributes, function () {
            test.redirect('/suggestions/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Suggestion.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/suggestions/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

