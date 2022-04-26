#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://cinvrhnlxmkszbrirgxg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjIxNzMzMCwiZXhwIjoxOTUxNzkzMzMwfQ.AUCfgsxVNn7LyUIoqqxYsF4Rqs-CeQEkLNBwKBzkpBo')

let global_user;
let global_session;
let logged_in = false;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    console.clear();
    const msg = 'Welcome to ASLO! \n';
	let rainbowTitle;

    figlet(msg, (err, data) => {
		rainbowTitle = chalkAnimation.rainbow(
			data
		);
        // console.log(gradient.pastel.multiline(data));
    });

	await sleep();
	rainbowTitle.stop();

	console.log(`
	Type ${chalk.bgBlue(' HELP ')} for commands

    `)
}

async function askName() {
	const answer = await inquirer.prompt({
		name: 'player_name',
		type: 'input',
		message: 'What is your name?',
		default() {
			return 'John Doe'
		}
	}); 

	userName = answer.player_name;
}

// LOGIN ----------------------------------

async function askLogin() {
	const email = await inquirer.prompt({
		name: 'user_email',
		type: 'input',
		message: 'What is your email?',
		validate(e) {
			if ( !/@/.test(e) ) {
				return 'Please enter a valid email address'
			}
			return true;
		}
	});

	const password = await inquirer.prompt({
		name: 'user_password',
		type: 'password',
		message: 'What is your password?',
		validate(e) {
			if ( e.length < 6 ) {
				return 'Please enter a valid password'
			}
			return true;
		}
	});

	await handleLogin(email.user_email, password.user_password)
}

async function handleLogin(userEmail, userPassword) {
	const { user, session, error } = await supabase.auth.signIn({
		email: userEmail,
		password: userPassword,
	});

	if (error === null) {
		global_user = user;
		global_session = session;
		return;
	}

	console.log(chalk.red(error.message));
	await askLogin();
}

async function greet() {
	let greeting = chalkAnimation.neon(`
	Good to see you ${global_user.user_metadata.first_name} \n`, 2);

	await sleep();
	greeting.stop();
}

// SIGNUP ---------------------------------

async function askSignUp() {
	const email = await inquirer.prompt({
		name: 'user_email',
		type: 'input',
		message: 'What is your email?',
		validate(e) {
			if ( !/@/.test(e) ) {
				return 'Please enter a valid email address'
			}
			return true;
		}
	});

	const password = await inquirer.prompt({
		name: 'user_password',
		type: 'password',
		message: 'What is your password?',
		validate(e) {
			if ( e.length < 6 ) {
				return 'Please enter a valid password'
			}
			return true;
		}
	});

	const confirm_password = await inquirer.prompt({
		name: 'user_password',
		type: 'password',
		message: 'What is your password?',
		validate(e) {
			if ( e.length < 6 ) {
				return 'Please enter a valid password'
			}
			return true;
		}
	});

	if (confirm_password.user_password !== password.user_password) {
		await askSignUp();
	}

	const first_name = await inquirer.prompt({
		name: 'user_first',
		type: 'input',
		message: 'What is your first name?',
		validate(e) {
			if ( e.length < 1 ) {
				return 'No name given'
			}
			return true;
		}
	});

	const last_name = await inquirer.prompt({
		name: 'user_last',
		type: 'input',
		message: 'What is your last name?',
		validate(e) {
			if ( e.length < 1 ) {
				return 'No name given'
			}
			return true;
		}
	});

	await handleSignUp(email.user_email, password.user_password, first_name.user_first, last_name.user_last)
}

async function handleSignUp(userEmail, userPassword, firstName, lastName) {
	const { user, session, error } = await supabase.auth.signUp({
		email: userEmail,
		password: userPassword,
	},
	{
	  data: { 
		first_name: firstName, 
		last_name: lastName,
	  }
	});

	if (error === null) {
		global_user = user;
		global_session = session;
		return;
	}

	console.log(chalk.red(error.message));
	await askSignUp();
}

// ALL ------------------------------------

async function askNew() {
    const item_type = await inquirer.prompt({
        name: 'new_item',
        type: 'list',
        message: 'What item do you want to create?',
        choices: [
            'Bug',
			'Note',
			'Project',
            'Task'
        ],
    });

	switch (item_type.new_item) {
		case "Bug":
			console.log(chalk.bgCyan('Bug'));
			break;

		case "Note":
			console.log(chalk.bgCyan('Note'));
			break;

		case "Project":
			console.log(chalk.bgCyan('Project'));
			break;
			
		case "Task":
			console.log(chalk.bgCyan('Task'));
			break;
	}

}

// NOTES ----------------------------------

async function getItems() {

	const item_type = await inquirer.prompt({
        name: 'new_item',
        type: 'list',
        message: 'What item do you want to fetch?',
        choices: [
            'Bug',
			'Note',
			'Project',
            'Task'
        ],
    });

	switch (item_type.new_item) {
		case "Bug":
			console.log(chalk.bgCyan('Bug'));
			break;

		case "Note":
			let data = await getNotes();

			data.push('<- Back <-');

			const display = await inquirer.prompt({
				name: 'data',
				type: 'list',
				message: 'Notes:',
				choices: data,
			});
			break;

		case "Project":
			console.log(chalk.bgCyan('Project'));
			break;
			
		case "Task":
			console.log(chalk.bgCyan('Task'));
			break;
	}

}

async function getNotes() {

	let res = await supabase
	.from('notes')
	.select();

	if (res.body.length == 0) {
		return [`
	You have no notes
`];
	}

	let data = [];

	res.body.forEach(element => {
		data.push(element.note);
	});

	return data;

}

// MISC -----------------------------------

async function help() {
	console.log(`
	HELP   - Prints out all commands
	NEW    - Creates a new item
	LOGIN  - Login to your ASLO account
	SIGNUP - Create an ASLO account
	EXIT   - Quits the program
	`)
}



// MAIN -----------------------------------

await welcome();

while (true) {

	const command = await inquirer.prompt({
		name: 'user_command',
		type: 'input',
		message: 'What do you want to do?',
	});

	let action = command.user_command;

	if (action.toLowerCase() === "exit") { break; }

	switch (action.toLowerCase()) {

		case "hi":
			
			let hello = chalkAnimation.neon(`
	Hey There! \n`, 2);
		
			await sleep();
			hello.stop();

			break;

		case "help":
			await help();
			break;

		case "login":
			await askLogin();
			await greet();
			break;

		case "signup":
			await askSignUp();
			break;

		case "new":
			await askNew();
			break;

		case "get":
			await getItems();
			break;

		default:
			console.log("\n");
	}

}