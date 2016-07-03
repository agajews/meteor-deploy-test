import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import {Tasks} from '../api/tasks.js';

import './tasks.js';
import './body.html';


Template.app.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.set('hideCompleted', false);
    Meteor.subscribe('tasks');
});


Template.app.events({
    'change .hide-completed input'(event) {
        Template.instance().state.set('hideCompleted', event.target.checked);
    },
})

Template.app.helpers({
    tasks() {
        if (Template.instance().state.get('hideCompleted')) {
            return Tasks.find({checked: false}, {sort: {createdAt: -1}});
        } else {
            return Tasks.find({}, {sort: {createdAt: -1}});
        }
    },
});


Template.taskForm.events({
    'submit .new-task'(event) {
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;

        Meteor.call('tasks.insert', text)

        target.text.value = '';
    },
});
