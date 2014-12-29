'use strict';

module.exports = function(communicator) {
    var name = 'discussion';
    var element = document.querySelector('#discussion');
    var user;

    return {
	getName: function() {
	    return name;
	},
	getElement: function() {
	    return element;
	},
	setUser: function(u) {
	    user = u;
	},
	run: function() {
	    setup(user, communicator);
	}
    };
};

// @todo use an HTML template instead of reusing the same DOM element
function setup(user, communicator) {
    var byId = function(id) { return document.getElementById(id); };
    var nameElement = byId('name');
    var inputElement = byId('input');
    var submitElement = byId('send');

    nameElement.textContent = user.name;

    // Voluntarily using .onclick instead of addEventListener; I want only one.
    submitElement.onclick = function() {
	communicator.send({
	    action: 'encrypt',
	    email: user.email,
	    message: inputElement.value,
	    name: user.name
	});

	inputElement.value = '';
    };

    getDiscussions(user);
}

function getDiscussions(user) {
    chrome.runtime.onMessage.addListener(function(request) {
	if (request.action === 'decrypted' && request.sender === user.name) {
	    addMessage(request.message);
	}
    });

    chrome.runtime.sendMessage({
	action: 'getMessages',
	user: user
    }, function(messages) {
	messages.forEach(addMessage);
    });
}

function addMessage(message) {
    document.getElementById('messages').innerHTML += '<div class="message">' + message + '</div>';
}
