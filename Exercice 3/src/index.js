import * as d3 from "d3";

//récupérer la liste des utilisateurs et des posts
Promise.all([
    d3.json("https://jsonplaceholder.typicode.com/users"),
    d3.json("https://jsonplaceholder.typicode.com/posts")
]).then(([users, posts]) => {
    // console.log(users);
    // console.log(posts);

    //Nouvelle structure de données (chaque usr à ses posts)
    const usersData = users.map(user => {
        const userPosts = posts.filter(post => post.userId === user.id);
        return {
            nom_utilisateur: user.name,
            ville: user.address.city,
            nom_companie: user.company.name,
            titres_posts: userPosts.map(post => post.title)
        };
    });
    console.log("✅ Structure combinée : ", usersData);

    //Nombre de posts par utilisateur
    const postCountByUser = users.map(user => ({
        userId: user.id,
        name: user.name,
        postCount: posts.filter(p => p.userId === user.id).length
    }));

    console.log("✅ Nombre de posts par utilisateur : ", postCountByUser);

    //Trouver le plus long texte
    const longestPost = posts.reduce((a, b) =>
        b.body.length > a.body.length ? b : a
    );

    const author = users.find(u => u.id === longestPost.userId);

    console.log("✅ Post le plus long : ", longestPost);
    console.log("✅ Auteur du post le plus long : ", author.name);

    //écrire dans le dom, le nombre de posts par usr et trouver qui a écri
    d3.select("body")
        .append("h2")
        .text("Nombre de posts par utilisateur");

    d3.select("body")
        .selectAll("p")
        .data(postCountByUser)
        .join("p")
        .text(d => `${d.name} a écrit ${d.postCount} posts`);

    d3.select("body")
        .append("p")
        .style("font-weight", "bold")
        .text(`Texte le plus long écrit par : ${author.name}`);


    // Créer le graphique
    const svg = d3.select("svg")
        .attr("width", 800)
        .attr("height", 400);

    // Créer les échelles
    const xScale = d3.scaleBand()
        .domain(postCountByUser.map(d => d.name))
        .range([50, 750])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(postCountByUser, d => d.postCount)])
        .nice()
        .range([350, 50]);

    // Ajouter les barres
    svg.selectAll("rect")
        .data(postCountByUser)
        .join("rect")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.postCount))
        .attr("width", xScale.bandwidth())
        .attr("height", d => 350 - yScale(d.postCount))
        .attr("fill", "steelblue")
        .attr("stroke", "white")
        .attr("stroke-width", "1px");

    // Ajouter les labels (noms des utilisateurs)
    svg.selectAll("text.labels")
        .data(postCountByUser)
        .join("text")
        .attr("class", "labels")
        .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.postCount) - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .text(d => d.postCount);

    // Ajouter les identifiants des utilisateurs en dessous des barres
    svg.selectAll("text.userIds")
        .data(postCountByUser)
        .join("text")
        .attr("class", "userIds")
        .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr("y", 370)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(d => `ID: ${d.userId}`);

});


