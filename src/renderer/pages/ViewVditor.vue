<template>
  <div class="order">
    <div style="min-height:87vh"
         id="ViewVditor"></div>
  </div>
</template>
<script>
import Vditor from "vditor";
import "vditor/dist/index.css";
export default {
  props: ["content", "questionMeta"],
  name: "ViewVditor",
  data () {
    return {
      contentEditor: ""
    };
  },
  mounted () {
    this.contentEditor = new Vditor("ViewVditor", {
      cdn: "https://cyber-jxpt.anrunlu.net/jscdn/vditor",
      toolbar: ["|"],
      preview: {
        math: {
          inlineDigit: true
        }
      },
      toolbarConfig: {
        // hide: true,
        pin: true
      },
      cache: {
        enable: false
      },
      after: () => {
        this.contentEditor.setValue(this.content);
        this.replaceToolBarContent(this.questionMeta);
      }
    });
  },
  watch: {
    content (val) {
      this.contentEditor.setValue(val);
    },
    questionMeta (val) {
      this.replaceToolBarContent(val);
    }
  },
  methods: {
    replaceToolBarContent (content) {
      const item = document.getElementsByClassName(
        "vditor-toolbar__divider"
      )[0];
      item.innerHTML = `<span>${content}</span>`;
    }
  }
};
</script>
