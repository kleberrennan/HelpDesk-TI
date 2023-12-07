function generateVerseBible() {
    const bibleVerses = [
        ` "Não fui eu que ordenei a você? Seja forte e corajoso! 
           Não se apavore nem desanime, pois o Senhor, o seu Deus, 
           estará com você por onde você andar" - Josué 1:9`,
        ` "E Adão conheceu Eva, que ela ficou grávida de Samael, 
           o anjo desejável, e ela concebeu e deu à luz a Caim e 
           ela disse: "Tenho adquirido um homem do anjo desejável" - Gênesis 4:1`,
        ` "Quem derramar sangue do homem,
           pelo homem seu sangue será derramado;
           porque à imagem de Deus
           foi o homem criado." - Gênesis 9:6`,
        ` "Encontro esta lei que atua em mim: Quando faço o bem,
           o mal me acompanha. Intimamente o meu ser
           tem prazer na Lei de Deus; mas vejo outra lei atuando nos 
           membros do meu corpo, guerreando contra a lei da minha mente, 
           tornando-me prisioneiro da lei do pecado que atua em mim".
           Romanos 7:21-23`
    ];

    let randNumber = Math.floor(Math.random() * bibleVerses.length);
    randNumber = randNumber % bibleVerses.length;

    $("#versesBible p").text(bibleVerses[randNumber]);
}
