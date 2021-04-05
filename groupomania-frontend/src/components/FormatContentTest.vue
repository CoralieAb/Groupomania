<script>
export default {
  name: 'FormatContentTest',
  functional: true,
  props: {
    brutContent: {
      type: String,
      required: true
    }
  },
  //To compensate for the lack of an instance,
  //We are now provided a 2nd context argument.
  render: function (createElement, context) {
    const children = [];
    const pChildren = [];
    const frameChildren = [];
    let lastMatchEnd = 0;
    const urlRegex = /(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/gi;
    const brutContent = context.props.brutContent;
    let match;
    while((match = urlRegex.exec(brutContent))) {
      if(match.index - lastMatchEnd > 0) {
        pChildren.push(brutContent.substring(lastMatchEnd, match.index));
      }
      pChildren.push(createElement('a', {
        attrs:{
          href: match[0],
        }
      }, match[0])); //Using capture group 1 instead of 0 to demonstrate that we can alter the text
      lastMatchEnd = urlRegex.lastIndex;
    }
    if(lastMatchEnd < brutContent.length) {
      pChildren.push(brutContent.substring(lastMatchEnd, brutContent.length));
    }
    children.push(createElement('p', {class: 'formatContent'}, pChildren));
    if (brutContent.match(urlRegex) !== null) {
      frameChildren.push(createElement('iframe', {
        attrs:{
          src: brutContent.match(urlRegex)[0].replace('/watch?v=', '/embed/'),
          frameborder: "0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowFullScreen: "allowFullScreen"
        },
        class: 'embed-responsive-item',
      }));
      children.push(createElement('div', {class: 'embed-responsive embed-responsive-16by9'}, frameChildren));
    }
    return createElement('div', {class: 'fullContent'}, children)
  },
}
</script>