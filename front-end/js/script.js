$(start);

function start() {
    $('#generator-btn').click(buildJson);
}

function buildJson() {
    console.log('Big button clicked!');

    $.getJSON('../json/data.json', function(json) {
        generateCV(json);
    });
}

function generateCV(json) {
    var jqxhr = $.ajax({
        url: 'http://localhost:8080/cv',
        type: 'POST',
        data: json,
        contentType: 'application/json; charset=utf-8'
    })
        .done(function(data) {
            console.log('Done!');

            downloadCV(data);
        })
        .fail(function() {
            console.log('Fail!');

            alert('Fail!');
        })
        .always(function() {
            console.log('Always!');
        });
}

function downloadCV(fileName) {
    var a = document.createElement('a');
    a.href = 'http://localhost:8080/' + fileName;
    a.setAttribute('target', '_blank');
    a.click();
}