"use strict";

var React = require("react");
var AuthorForm = require("./authorForm.jsx");
var AuthorApi = require("../../api/authorApi");
var Router = require("react-router");
var toastr = require("toastr");

var ManageAuthorPage = React.createClass({

  mixins: [
    Router.Navigation
  ],

  statics: {
    willTransitionFrom: function(transition, component){
      if(component.state.dirty && !confirm("Leave without saving?")){
        transition.abort();
      }
    }
  },

  getInitialState: function(){
    return {
      author: {
        id: '',
        firstName: '',
        lastName: ''
      },
      errors: {},
      dirty: false
    };
  },

  componentWillMount: function(){
    // set state before rendering occurs

    var authorId = this.props.params.id; // from path '/author/:id'

    if(authorId){
      this.setState({ author: AuthorApi.getAuthorById(authorId)});
    }
  },

  setAuthorState: function(e){
    this.setState({ dirty: true});
    var field = e.target.name;
    var value = e.target.value;

    this.state.author[field] = value;

    return this.setState({ author: this.state.author });
  },

  authorFormIsValid: function(){
    var formIsValid = true;

    this.state.errors = {}; //clear previous errors

    if(this.state.author.firstName.length < 3){
      this.state.errors.firstName = "First Name must be at least 3 characters";
      formIsValid = false;
    }

    if(this.state.author.lastName.length < 3){
      this.state.errors.lastName = "Last Name must be at least 3 characters";
      formIsValid = false;
    }

    this.setState({ errors: this.state.errors});

    return formIsValid;
  },

  saveAuthor: function(e){
    e.preventDefault();

    if(!this.authorFormIsValid()){
      return;
    }

    AuthorApi.saveAuthor(this.state.author);

    this.setState({ dirty: true});

    toastr.success("Author saved.");

    this.transitionTo("authors");
  },

  render: function(){
    return (
      <div>
        <h1>Manage Author</h1>
        <AuthorForm 
          onChange={this.setAuthorState} 
          author={this.state.author} 
          onSave={this.saveAuthor} 
          errors={this.state.errors}
        />
      </div>
    );
  }
});

module.exports = ManageAuthorPage;
