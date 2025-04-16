let currentTerm = 1;
const totalTerms = 3;

function showTerm(termNumber) {
    $('.term').addClass('d-none');
  
    $('#term' + termNumber).removeClass('d-none');
  
    $('#previous').prop('disabled', termNumber === 1);
    $('#next').prop('disabled', termNumber === totalTerms);
  }

// Function to check input as the user types
function checkInput(inputId, termId, correctTerm, messageId) {
  $('#' + inputId).on('input', function() {
    const typedText = $(this).val().trim().toLowerCase(); // Get and trim the typed input

    $('#' + messageId).addClass('d-none'); // Hide message initially

    if (typedText === correctTerm.toLowerCase()) {
      $(`#${termId}`).removeClass('d-none'); // Show the correct term
    }
  });
}

function handleSubmit(inputId, termId, correctTerm, messageId) {
  const typedText = $('#' + inputId).val().trim().toLowerCase();

  $('#' + messageId).removeClass('d-none');

  if (typedText === correctTerm.toLowerCase()) {
    $(`#${termId}`).removeClass('d-none'); 
    $('#' + messageId).text('Correct!').removeClass('text-danger').addClass('text-success');
  } else {
    $('#' + messageId).text('Incorrect! Please try again.').removeClass('text-success').addClass('text-danger');
  }
}

checkInput('input1', 'term1', 'HTML', 'message1');
checkInput('input2', 'term2', 'CSS', 'message2');
checkInput('input3', 'term3', 'JavaScript', 'message3');

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

// Submit button functionality
$('#submit').on('click', function() {
  if (currentTerm === 1) {
    handleSubmit('input1', 'term1', 'HTML', 'message1');
  } else if (currentTerm === 2) {
    handleSubmit('input2', 'term2', 'CSS', 'message2');
  } else if (currentTerm === 3) {
    handleSubmit('input3', 'term3', 'JavaScript', 'message3');
  }
});
