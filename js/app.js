// Graphql Api

const fullName = document.getElementById("name");
const user = document.getElementById("username");
const topUser = document.getElementById("p-name");
const profilePic = document.getElementById("profile-pic");
const picture = document.getElementById("pic");
const bio = document.getElementById("bio");

const rep = document.getElementById("parent-rep");

const divColor = document.getElementsByClassName("color");

let getUsername = () => {
  const username = (document.getElementById("username")).value;
  localStorage.setItem('username', username);
  window.location.href = "profile.html"
}

  const username = (document.getElementById("username")).value;

  const github_token = {
    token: "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",
    username: "favalcodes",
  };
  const baseUrl = "https://api.github.com/graphql";

  fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + github_token["token"],
    },
    body: JSON.stringify({
      query: `
    {
      user(login: "${localStorage.getItem('username')}") {
        name
        bio
        login
        avatarUrl
        repositories(last: 20, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: ASC}) {
          nodes {
            primaryLanguage {
              name
              color
            }
            updatedAt
            stargazerCount
            name
            forkCount
            description
          }
        }
      }
    }
          
        `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const item = data.data.user;
      const repoInfo = item.repositories.nodes;

      repoInfo.map((repo, index) => {

        let dob = new Date(repo.updatedAt);
        let dobArr = dob.toDateString().split(" ");
        let dobFormat = dobArr[2] + " " + dobArr[1];

        rep.innerHTML += `<div class="rep" id="rep">
      <div class="rep-left">
        <h3 class="rep-name" id="repo-name-${index}">
          <strong>${repo.name}</strong>
        </h3>
        <p class="tagline" id="desc-${index}">${repo.description ?? ''}</p>
        <div class="repo-info">
          <div class="lang">
            <div class="color" id="color-${index}" style="background-color: ${
          repo.primaryLanguage?.color
        }"></div>
            <p id="lang-${index}">${repo.primaryLanguage?.name ?? ""}</p>
          </div>
          <div class="star">
            <i class="fa fa-star-o"></i>
            <p id="star">${repo.stargazerCount}</p>
          </div>
          <div class="fork">
            <i class="fas fa-code-branch"></i>
            <p id="fork">${repo.forkCount}</p>
          </div>
          <p>updated on <span id="update">${dobFormat}</span></p>
        </div>
      </div>
      <div class="rep-right">
        <button class="btn"><i class="fa fa-star-o"></i> Star</button>
      </div>
    </div> <hr />`;
      });

      profilePic.src = item.avatarUrl;
      picture.src = item.avatarUrl;
      fullName.textContent = item.name;
      user.textContent = item.login;
      topUser.textContent = item.login;
      bio.textContent = item.bio;
    });

