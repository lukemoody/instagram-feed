import axios from 'axios';

// TODO: Setup Facebook App and configure => https://developers.facebook.com/docs/instagram-basic-display-api/getting-started
const instagramGraphApi = () => {

  // API variables
  const apiRoute = 'https://graph.instagram.com/';
  const userID = insta_user_id;
  const accessToken = insta_access_token; // TODO: lasts for 60 days currently => https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens/
  const getFields = 'id,media_type,media_url,thumbnail_url,permalink';
  const setLimit = '4';

  // GET user data (might not be needed now -- but could be required to autogenerate new access token after 60 days. Need to look into this)
  function getUserAccount() {
    return axios.get(apiRoute + userID + '?fields=id,username,account_type,media_count' + '&access_token=' + accessToken);
  }

  // GET a list of all media IDs
  function getUserMedia() {
    return axios.get(apiRoute + userID + '/media' + '?access_token=' + accessToken + '&fields=' + getFields + '&limit=' + setLimit);
  }

  // Multiple concurrent requests
  Promise.all([getUserAccount(), getUserMedia()])
    .then(function (response) {

      // const userData = response[0];
      const mediaData = response[1];
      // console.log(userData);
      // console.log(mediaData);

      let imgArr = [],
        img;

      // Grab all media IDs
      for (let i = 0; i < mediaData.data.data.length; i++) {

        // Check if media_type is IMAGE to return correct src
        if (mediaData.data.data[i].media_type == 'IMAGE') {
          img = `
          <li>
            <a href="${mediaData.data.data[i].permalink}" target="_blank">
              <div class="mask">
                <img src="${mediaData.data.data[i].media_url}"/>
              </div>
            </a>
          </li>
          `;
        }

        // Check if media_type is VIDEO  to return correct src
        if (mediaData.data.data[i].media_type == 'VIDEO') {
          img = `
          <li>
            <a href="${mediaData.data.data[i].permalink}" target="_blank">
              <div class="mask">
                <img src="${mediaData.data.data[i].thumbnail_url}"/>
              </div>
            </a>
          </li>
          `;
        }
        
         // Check if media_type is CAROUSEL_ALBUM  to return correct src
        if (mediaData.data.data[i].media_type == 'CAROUSEL_ALBUM') {
          img = `
          <li>
            <a href="${mediaData.data.data[i].permalink}" target="_blank">
              <div class="mask">
                <img src="${mediaData.data.data[i].media_url}"/>
              </div>
            </a>
          </li>
          `;
        }

        imgArr.push(img);
      }

      document.getElementById('instagram').innerHTML = imgArr.join('');
    });

}

export default instagramGraphApi;
