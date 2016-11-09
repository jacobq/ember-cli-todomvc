import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
    this.route('todos', { path: '/' }, function () {
        this.route('all', { path: '/' });
        this.route('active');
        this.route('completed');
    });
});

export default Router;
