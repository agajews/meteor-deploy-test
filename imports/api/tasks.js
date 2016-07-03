import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks_collection');

if (Meteor.isServer) {
    Meteor.publish('tasks', function() {
        return Tasks.find({
            $or: [
                {private: false},
                {owner: this.userId},
            ],
        });
    });
}

function checkPrivAuth(taskId, that) {
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== that.userId) {
        throw new Meteor.Error('not-authorized');
    }
}

Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            checked: false,
            private: false,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },

    'tasks.remove'(taskId) {
        checkPrivAuth(taskId, this);
        check(taskId, String);

        Tasks.remove(taskId);
    },

    'tasks.setChecked'(taskId, setChecked) {
        checkPrivAuth(taskId, this);
        check(taskId, String);
        check(setChecked, Boolean);

        Tasks.update(taskId, {$set: {checked: setChecked}});
    },

    'tasks.setPrivate'(taskId, setPrivate) {
        checkPrivAuth(taskId, this);
        check(taskId, String);
        check(setPrivate, Boolean);

        Tasks.update(taskId, {$set: {private: setPrivate}});
    },
});
