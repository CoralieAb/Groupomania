<script>
export default {
  name: 'FormatContent',
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
    let lastMatchEnd = 0;
    const urlRegex = /(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/gi;
    const brutContent = context.props.brutContent;
    let match;
    while((match = urlRegex.exec(brutContent))) {
      if(match.index - lastMatchEnd > 0) {
        children.push(brutContent.substring(lastMatchEnd, match.index));
      }
      children.push(createElement('a', {
        attrs:{
          href: match[0],
        }
      }, match[0])); //Using capture group 1 instead of 0 to demonstrate that we can alter the text
      lastMatchEnd = urlRegex.lastIndex;
    }
    if(lastMatchEnd < brutContent.length) {
      children.push(brutContent.substring(lastMatchEnd, brutContent.length));
    }
    return createElement('p', {class: 'formatContent'}, children)
  },
}
</script>