module.exports = {
	'env': {
		'node': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'overrides': [
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			2
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		// if we use == instead of ===
		'eqeqeq': 'error',
		'arrow-spacing': [
			'error', { 'before': true, 'after': true }
		],
		'object-curly-spacing': [
			'error', 'always'
		],
		// deactivate a recommended rule
		'no-console': 0
	}
}
