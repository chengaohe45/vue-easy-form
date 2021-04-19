<template>
  <div class="version-select-box">
    <el-select v-model="value" placeholder="请选择" size="small" @change="changeHandler">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Vue from "vue";
import "./entry";
import axios from "axios";

const SUFFIX_VERSION = process.env.SUFFIX_VERSION;
export default {
  data() {
    return {
      options: [],
      value: process.env.VUE_DOCS_VERSION + SUFFIX_VERSION,
      maxVersion: false
    };
  },

  props: {},

  computed: {},

  created() {
    axios("https://www.fastmock.site/mock/d3b0c1fcb73fc849fbbf1bffa19e6f99/demo/version", {
      methods: "get",
      params: {}
    }).then((response) => {
      // console.log("response", response);
      var data = response.data.data;
      data = data ? data : [];
      var list = data.map(function(value) {
        value = value + "";
        if (value.indexOf(SUFFIX_VERSION) < 0) {
          value += SUFFIX_VERSION;
        }
        return {id: value, name: value};
      });
      if (list.length > 0) {
        this.$data.maxVersion = list[0].id.replace(SUFFIX_VERSION, "");
      }
      this.$data.options = list;
    })
  },

  components: {},

  methods: {
    resolvePath() {
      var args = arguments;
      if (args.length <= 1) {
        return args[0];
      }
      var newPaths = [];
      var regRight = /\/+$/g;
      var regLeft = /^\/+/g;
      var regAll = /^\/+|\/+$/g;
      for (var i = 0; i < args.length; i++) {
        var path = args[i];
        if (i == 0) {
          path = path.replace(regRight, "");
        } else if (i == (args.length - 1) ) {
          path = path.replace(regLeft, "");
        } else {
          path = path.replace(regAll, "");
        }
        if (path) {
          newPaths.push(path);
        }
      }
      return newPaths.join("/");
    },
    changeHandler(value) {
      if (!value) {
        return;
      }

      value = value.replace(SUFFIX_VERSION, "");

      var href = location.href;
      var splitTxt = process.env.URL_SEPARATOR;
      var latestBaseUrl = process.env.LATEST_BASE_URL;
      var prefixVersion = process.env.PREFIX_VERSION;

      if (href.indexOf(splitTxt) >= 0) {
        var urlArr = href.split(splitTxt);
        var newHref;
        if (value >= this.$data.maxVersion) {
          newHref = this.resolvePath(urlArr[0], latestBaseUrl, urlArr[1]);
        } else {
          newHref = this.resolvePath(urlArr[0], prefixVersion, value, urlArr[1]);
        }
        if (href != newHref) {
          location.href = newHref;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.version-select-box {
  width: 140px;
}
</style>
