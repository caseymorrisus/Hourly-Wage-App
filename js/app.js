var main = function() {
	"use strict";

	// CREATING RULES FOR PAY INTERFACE
	//
	// Function for adding error messages when validation fails
	var add_error_message = function (object, message) {
		var object_container = object.parent();
		var error_container = $('<span class="error-message">');
		if (object_container.children('.error-message').length === 0) {
			object_container.append(error_container.text(message));
		}
	};
	// Validating rule and base wage inputs
	//
	// Base Hourly Wage must be a valid integer
	$('.pay-interface').on('input', '#base-wage', function () {
		var input = $(this);
		var base_wage = input.val();
		var input_container = input.parent();
		if (base_wage == parseInt(base_wage)) {
			input_container.removeClass('has-error').addClass('has-success');
			input_container.children('.error-message').remove();
		} else {
			input_container.removeClass('has-success').addClass('has-error');
			add_error_message(input, "Must input an integer value.");
		}
	});
	// Title Can Not Be Blank
	$('#rule-title').on('input', function () {
		var input = $(this);
		var title = input.val();
		var input_container = input.parent();
		if (title) {
			input_container.removeClass('has-error').addClass('has-success');
			input_container.children('.error-message').remove();
		} else {
			input_container.removeClass('has-success').addClass('has-error');
			add_error_message(input, "Must input a title.");
		}
	});
	// Base modifier must be a valid integer
	$('#base-modifier').on('input', function () {
		var input = $(this);
		var base_modifier = input.val();
		var input_container = input.parent();
		if (base_modifier == parseInt(base_modifier)) {
			input_container.removeClass('has-error').addClass('has-success');
			input_container.children('.error-message').remove();
		} else {
			input_container.removeClass('has-success').addClass('has-error');
			add_error_message(input, "Must input an integer value.");
		}
	});
	// Function for adding new rules to the DOM
	var add_rule_to_dom = function () {
		var container = $('<div class="rule">');
		var rule_title = $('#rule-title').val();
		var base_modifier = $('#base-modifier').val();
		// Validate that Rule Title and Modifier are not empty
		if (rule_title !== '' && base_modifier !== '') {
			// Function for clearing inputs after a rule is submitted
			var clear_inputs = function () {
				$("#rule-title").val('');
				$("#rule-title").parent().removeClass('has-success');
				$("#base-modifier").val('');
				$("#base-modifier").parent().removeClass('has-success');
			};
			// Function for appending rules to the DOM
			var add_rules = function (title, modifier) {
				$('.rules-created').append(container.append("<em>" + title + "</em>: " + modifier).append(''));
				clear_inputs();
				$('#rule-title').focus();
				$('.error-message').remove();
			};
			// Validate inputs before adding rule to the DOM
			var number_of_errors = $('.rules').find('.error-message').length;
			if (number_of_errors === 0) {
				add_rules(rule_title, base_modifier);
			} else {
				alert("Please check for errors.\n" + number_of_errors + " error(s).");
			}
		} else {
			if (rule_title === '') {
				add_error_message($('#rule-title'), "Must add values!");
			}
			if (base_modifier === '') {
				add_error_message($('#base-modifier'), "Must add values!");
			}
		}
	};
	// Add event for when Add Rule button is clicked.
	$('#add-rule').on('click', function () {
		add_rule_to_dom();
	});
	// Add event for when return key is pressed
	$('#base-modifier').on('keydown', function (e) {
		if (e.which == 13) {
			add_rule_to_dom();
		}
	});
	// Add remove button when rule is hovered 
	// Remove button when no longer hovered
	$('.rules-created').on('mouseenter', '.rule', function () {
		$(this).append('<span class="remove-rule glyphicon glyphicon-remove"></span>');
	}).on('mouseleave', '.rule', function () {
		$(this).children('.remove-rule').remove();
	});
	// Add event for when Rule Remove is clicked
	$('.rules-created').on('click', '.remove-rule', function () {
		$(this).parent().remove();
	});
	// CREATING THE PAY INTERFACE BASED ON RULES AND BASE HOURLY WAGE
	//
	// Create array of objects to hold rule values by looping through Rules DOM objects
	$('#create-pay-interface').on('click', function () {
		// Array to hold list of rules
		var rules_array = [];
		// Turn each rule into object and push to rules array
		$('.rule').each(function () {
			var rule = {};
			var value = $(this).text().split(": ");
			rule.title = value[0];
			rule.base_modifier = value[1];
			rules_array.push(rule);
		});
		// Function to hide original forms and unhide Pay Interface
		var hide_original_forms = function () {
			$('.forms-container').hide();
			$('.pay-interface').fadeIn();
		};
		// Function to create Pay Interface
		var create_pay_interface = function () {
			// Validate that at least 1 rule is present
			if (rules_array.length > 0) {
				hide_original_forms();
				// Empty Pay Interface in case it's already populated
				$('.pay-interface').empty();
				// Add Back To Editor tab to Pay Interface
				$('.pay-interface').append('<span class="back-to-editor">Return to Editor</span>');
				// Add instructions
				$('.pay-interface').append($('<div class="instructions p-i">').text(
					'Enter a Base Wage, it must be an integer. Choose from the rules you previously created to determain the final wage. If you wish to add more rules, click Return to Editor.'
				));
				// Append Base Wage to the Pay Interface
				var base_wage_container = $('<div class="input-group base-wage-container">');
				var base_span = '<span class="input-group-addon">Base Hourly Wage</span>';
				var base_input = '<input type="text" id="base-wage" class="form-control placeholder="200">';
				$('.pay-interface').append(base_wage_container.append(base_span, base_input));
				// Add Title of Added Rules
				$('.pay-interface').append('<h4>Rules</h4>');
				// Loop over rules array and add each rule to the Pay Interface  
				$.each(rules_array, function (index, element) {
					// Container for Rules
					var rule_container = $('<div class="checkbox">');
					var label = $('<label class="created_rule">');
					var input = $('<input type="checkbox" value="' + element.base_modifier + '">');
					// Append rules (inside container) to the Pay Interface
					$('.pay-interface').append(rule_container.append(label.append(input, "<em>" + element.title + "</em>: " + element.base_modifier + "/hr")));
				});
				// Add button to created modified pay
				$('.pay-interface').append('<button type="button" id="calculate-modified-pay" class="btn btn-primary">Calculate Modified Pay</button>');
				// Add Pay after Modifiers
				$('.pay-interface').append('<h4 class="modified_pay">Pay After Modifiers</h4>');
			} else {
				add_error_message($('#create-pay-interface'), "Must have at least 1 rule.");
			}
		};
		create_pay_interface();
		// Function to return to Editor View
		$('.back-to-editor').on('click', function () {
			$('.pay-interface').hide();
			$('.forms-container').fadeIn();
		});
		// Define global base_wage variable
		var base_wage;
		// Function to calculate modified pay
		$('.pay-interface').on('click', '#calculate-modified-pay', function () {
			base_wage = $('#base-wage').val();
			if (base_wage !== '') {
				// Convert Base Wage to integer
				var new_wage = parseInt(base_wage);
				// Create container to put final wage into
				var container = $('<div class="final-wage">');
	        var error_container = $('<div class="final-wage-error">');
				// Function to increase base wage
				var increaseRate = function (modifier) {
					new_wage = new_wage + modifier;
				};
				// Function to decrease base wage
				var decreaseRate = function (modifier) {
					new_wage = new_wage + modifier;
				};
				// Loop through each checked modifier and add or subtract from base wage
				$("input:checked").each(function () {
					var modifier_value = parseInt($(this).val());
					if (modifier_value >= 0) {
						// If modifier is positive, increase rate.
						increaseRate(modifier_value);
					} else {
						// If modifier is negative, decrease rate.
						decreaseRate(modifier_value);
					}
				});
				// Empty final wage container in case wage was added previously
				$('.final-wage').empty();
	        $('.final-wage-error').remove();
				// Check if final wage already exists and remove if so.
				if ($('.pay-interface').find($('.final-wage')).length !== 0) {
					$('.final-wage').remove();
				}
				// Append final wage into container
	        if (new_wage >= 0) {
	          $('.pay-interface').append(container.text("$" + new_wage + "/hr"));
	        } else {
	          $('.pay-interface').append(error_container.text("Final Wage is negative, increase Base Pay or change rules."));
	        }
			} else {
				add_error_message($('#base-wage'), "Must input an integer value.");
			}
		});
	});
};

$(document).ready(main);