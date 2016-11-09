import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'ul',
    classNames: ['todo-list'],
    items: null,
    remaining: function () {
        return this.get('items').filterBy('isCompleted', false).get('length');
    }.property('@each.isCompleted'),
    inflection: function () {
        let remaining = this.get('remaining');
        return remaining === 1 ? 'item' : 'items';
    }.property('remaining')
});
