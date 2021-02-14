const DEFAULT_LOGO_PATH = "../images/profile/upload.png";
const USER_LOGO_PATH = "../uploads/";
const resolvePathToImage = function(profile_photo_path){
    if (profile_photo_path) {
        return USER_LOGO_PATH + profile_photo_path
    }
    return DEFAULT_LOGO_PATH;
}

exports.resolvePathToImage = resolvePathToImage;
exports.DEFAULT_LOGO_PATH = DEFAULT_LOGO_PATH;
exports.USER_LOGO_PATH = USER_LOGO_PATH;