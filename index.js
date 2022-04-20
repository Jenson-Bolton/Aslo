#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://cinvrhnlxmkszbrirgxg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjIxNzMzMCwiZXhwIjoxOTUxNzkzMzMwfQ.AUCfgsxVNn7LyUIoqqxYsF4Rqs-CeQEkLNBwKBzkpBo')

let userName;
let userEmail;
let userPassword;
let global_user;
let global_session;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
	const ranbowTitle = chalkAnimation.rainbow(
		'Welcome to Aslo! \n'
	);

	await sleep();
	ranbowTitle.stop();

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

	userEmail = email.user_email;

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

	userPassword = password.user_password;

	handleLogin()
}

async function handleLogin() {
	const { user, session, error } = await supabase.auth.signIn({
		email: userEmail,
		password: userPassword,
	});
	if (error === null) {
		console.log("yo");
		global_user = user;
		global_session = session;
	}

	console.log(chalk.red(error.message));
	await askLogin();
}

async function greet() {
	let greeting = chalkAnimation.neon(`\n Good to see you ${global_user.user_metadata.first_name} ${global_user.user_metadata.last_name} \n`, 2);

	await sleep();
	greeting.stop();
}

await welcome();
await askLogin();
await greet();