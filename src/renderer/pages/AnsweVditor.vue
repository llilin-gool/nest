<template>
  <div class="order">
    <div style="min-height:87vh"
         id="AnswerVditor"></div>
  </div>
</template>
<script>
import Vditor from "vditor";
import "vditor/dist/index.css";
export default {
  props: {
    value: {
      // 初始 value
      type: String,
      default: ""
    }
  },
  name: "AnswerVditor",

  data () {
    return {
      newValue: "",
      contentEditor: {},
      progress: 0
    };
  },
  mounted () {
    let that = this;
    this.contentEditor = new Vditor("AnswerVditor", {
      cdn: "https://cyber-jxpt.anrunlu.net/jscdn/vditor",
      // mode: "wysiwyg",
      typewriterMode: true,
      placeholder: "请输入您的答案...",
      toolbar: [
        "emoji",
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        // "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        // "insert-before",
        // "insert-after",
        "|",
        "upload",
        // "record",
        "table"
        // "|",
        // "undo",
        // "redo"
      ],
      toolbarConfig: {
        // hide: true,
        pin: true
      },
      cache: {
        enable: false
      },
      after: () => {
        this.contentEditor.setValue(this.value);
      },
      input: () => {
        // this.$emit("input", this.contentEditor.getValue());
      },
      blur: () => {
        this.$emit("input", this.contentEditor.getValue());
      },
    });
  },
  watch: {
    value (val, oldVal) {
      this.contentEditor.setValue(val);
    }
  },
  methods: {}
};
</script>
