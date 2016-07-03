import {Template} from 'meteor/templating';

import {Tasks} from '../api/tasks.js';

import './task.html';

Template.taskBody.helpers({
    isOwner() {
        return this.task.owner === Meteor.userId();
    },
});

Template.taskBody.events({
    'click .toggle-checked'() {
        Meteor.call('tasks.setChecked', this.task._id, !this.task.checked);
    },
    'click .delete-task'() {
        Meteor.call('tasks.remove', this.task._id);
    },
    'click .toggle-private'() {
        Meteor.call('tasks.setPrivate', this.task._id, !this.task.private);
    },
});
