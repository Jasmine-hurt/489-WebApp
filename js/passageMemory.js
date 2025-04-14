let currentTerm = 1;
const totalTerms = 3;

function showTerm(termNumber) {
  $('.term').addClass('d-none');

  $('#term' + termNumber).removeClass('d-none');

  $('#previous').prop('disabled', termNumber === 1);
  $('#next').prop('disabled', termNumber === totalTerms);
}

function checkInput(inputId, descriptionId, correctDescription, messageId) {
  $('#' + inputId).on('input', function() {
    const typedText = $(this).val().trim();

    $('#' + messageId).addClass('d-none');

    if (typedText === correctDescription) {
      $(`#${descriptionId}`).removeClass('d-none');
    }
  });
}

function handleSubmit(inputId, descriptionId, correctDescription, messageId) {
  const typedText = $('#' + inputId).val().trim();

  $('#' + messageId).addClass('d-none');

  if (typedText === correctDescription) {
    $(`#${descriptionId}`).removeClass('d-none');
    $('#' + messageId).removeClass('d-none').text('Correct!').addClass('text-success');
  } else {
    $('#' + messageId).removeClass('d-none').text('Incorrect! Please try again.').addClass('text-danger');
  }
}

checkInput('input1', 'description1', 'HTML stands for HyperText Markup Language. It is the standard language for creating webpages. It uses a system of tags to structure content on the web.', 'message1');
checkInput('input2', 'description2', 'CSS stands for Cascading Style Sheets. It is used to style and format the layout of webpages. It controls how HTML elements are displayed visually on the screen.', 'message2');
checkInput('input3', 'description3', 'JavaScript is a programming language that allows developers to create interactive effects within web browsers. It is essential for dynamic content on webpages.', 'message3');


showTerm(currentTerm);


$('#next').on('click', function() {
  if (currentTerm < totalTerms) {
    currentTerm++;
    showTerm(currentTerm);
  }
});

$('#previous').on('click', function() {
  if (currentTerm > 1) {
    currentTerm--;
    showTerm(currentTerm);
  }
});

$('#submit').on('click', function() {
  if (currentTerm === 1) {
    handleSubmit('input1', 'description1', 'A markup language for creating web pages', 'message1');
  } else if (currentTerm === 2) {
    handleSubmit('input2', 'description2', 'A style sheet language used for describing the look of a document', 'message2');
  } else if (currentTerm === 3) {
    handleSubmit('input3', 'description3', 'A programming language used to create dynamic content on websites', 'message3');
  }
});
