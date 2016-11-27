$(start);

var count = {
    "experience": 0,
    "education": 0,
    "language": 0,
    "skill": 0
};

function start() {
    $('#nome').focus();
    loadStates();
    loadMonth();
    loadYear();

    $('#generator-btn').click(buildJson);

    $('#add-experience').click(addExperience);
    $('#add-education').click(addEducation);
    $('#add-language').click(addLanguage);
    $('#add-skill').click(addSkill);
}

function loadStates() {
    $.getJSON('json/Estados.json', function(data) {
        var options = '';

        $.each(data, function() {
            var option = '';

            option += '<option value="' + this.ID + '">';
            option += this.Sigla + '</option>';

            options += option;
        });

        $('#estado').html(options).change();
    });

    $('#estado').change(function() {
        loadCidades($(this).val());
    });
}

function loadCidades(state) {
    $.getJSON('json/Cidades.json', function(data) {
        var options = '';

        $.each(data, function() {
            if(this.Estado === state) {
                var option = '';

                option += '<option value="' + this.ID +'">';
                option += this.Nome + '</option>';

                options += option;
            }
        });

        $('#cidade').html(options);
    });
}

function loadMonth() {
    var options = '',
        months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    $.each(months, function(k, v) {
        var option = '';

        option += '<option value="' + (k + 1) + '">';
        option += v + '</option>';

        options += option;
    });

    $('.month').html(options);
}

function loadYear() {
    var today = new Date(),
        thisYear = today.getUTCFullYear(),
        options = '';

    for(i = (thisYear - 100); i <= (thisYear + 50); i++) {
        var option = '';

        option += '<option value="' + i + '"';
        if(i === thisYear) option += ' selected';
        option += '>' + i + '</option>';

        options += option;
    }

    $('.year').html(options);
}

function addExperience() {
    var html = '';
    html += '<div id="experience-' + count.experience + '">';
    html += $('#experience-template').html();
    html += '</div>';

    $('#experiences').append(html);

    count.experience++;
}

function addEducation() {
    var html = '';
    html += '<div id="education-' + count.education + '">';
    html += $('#education-template').html();
    html += '</div>';

    $('#educations').append(html);

    count.education++;
}

function addLanguage() {
    var html = '';
    html += '<div id="language-' + count.language + '">';
    html += $('#language-template').html();
    html += '</div>';

    $('#languages').append(html);

    count.language++;
}

function addSkill() {
    var html = '';
    html += '<div id="skill-' + count.skill + '">';
    html += $('#skill-template').html();
    html += '</div>';

    $('#skills').append(html);

    count.skill++;
}

function buildJson() {
    var json = {};

    json.dadosPessoais = buildPersonalDetails();
    json.experiencias = buildExperiences();
    json.formacoes = buildEducations();
    json.idiomas = buildLanguages();
    json.habilidades = buildSkills();

    generateCV(json);
}

function buildPersonalDetails() {
    var personalDetails = [],
        json = {};

    json.nome = $('#nome').val();
    json.endereco = $('#endereco').val();
    json.cidade = $('#cidade option:selected').text();
    json.estado = $('#estado option:selected').text();
    json.telefone = $('#telefone').val();
    json.email = $('#email').val();

    personalDetails.push(json);

    return personalDetails;
}

function buildExperiences() {
    var experiences = [];

    for(i = 0; i < count.experience; i++) {
        var json = {};

        var inicio = '',
            fim = '';

        inicio += ('0' + $('#experience-' + i + ' .mes-inicio').val()).slice(-2);
        inicio += '/' + $('#experience-' + i + ' .ano-inicio').val();

        fim += ('0' + $('#experience-' + i + ' .mes-fim').val()).slice(-2);
        fim += '/' + $('#experience-' + i + ' .ano-fim').val();

        json.inicio = inicio;
        json.fim = fim;
        json.titulo = $('#experience-' + i + ' .titulo').val();
        json.empresa = $('#experience-' + i + ' .empresa').val();
        json.detalhes = $('#experience-' + i + ' .detalhes').val();

        experiences.push(json);
    }

    return experiences;
}

function buildEducations() {
    var educations = [];

    for(i = 0; i < count.education; i++) {
        var json = {};

        json.inicio = $('#education-' + i + ' .inicio').val();
        json.fim = $('#education-' + i + ' .fim').val();
        json.grau = $('#education-' + i + ' .grau').val();
        json.area = $('#education-' + i + ' .area').val();
        json.instituicao = $('#education-' + i + ' .instituicao').val();
        json.detalhes = $('#education-' + i + ' .detalhes').val();

        educations.push(json);
    }

    return educations;
}

function buildLanguages() {
    var languages = [];

    for(i = 0; i < count.language; i++) {
        var json = {};

        json.lingua = $('#language-' + i + ' .lingua').val();
        json.nivel = $('#language-' + i + ' .nivel').val();

        languages.push(json);
    }

    return languages;
}

function buildSkills() {
    var skills = [];

    for(i = 0; i < count.skill; i++) {
        var json = {};

        json.nome = $('#skill-' + i + ' .nome').val();

        skills.push(json);
    }

    return skills;
}

function generateCV(json) {
    var jqxhr = $.ajax({
        url: 'http://localhost:5000/cv',
        type: 'POST',
        data: JSON.stringify(json),
        contentType: 'application/json; charset=UTF-8'
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
    window.location.href = 'http://localhost:5000/' + fileName;
}