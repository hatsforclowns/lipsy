<template>
  <v-app>
    <v-toolbar app align-center flat>
      <v-toolbar-title>
        <span>Lipsy</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Length slider -->
      <v-slider hide-details v-model="currentLength" label="Length"></v-slider>
      <v-spacer></v-spacer>
      <!-- Type select -->
      <v-input label="Type" hide-details>
        <v-select
          :items="['words', 'sentences', 'paragraphs']"
          v-model="currentType"
          solo
          flat
          hide-details
        ></v-select>
      </v-input>
      <v-spacer></v-spacer>
      <!-- Begin with 'Lorem ipsum' select -->
      <v-checkbox
        hide-details
        label="Begin text with 'Lorem ipsum...'"
      ></v-checkbox>
      <v-spacer></v-spacer>
      <!-- Actions -->
      <v-toolbar-items>
        <v-btn flat @click="generateLipsum()"
          ><span v-if="currentText == undefined">Generate</span
          ><span v-else>Refresh</span></v-btn
        >
        <v-btn
          :disabled="currentText == undefined"
          flat
          @click="copyToClipboard()"
          ><span>Copy</span></v-btn
        >
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-spacer></v-spacer>
          <v-flex md5>
            <v-textarea
              v-model="currentText"
              flat
              full-width
              hide-details
              no-resize
              solo
              readonly
            ></v-textarea>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex md3>
            Documentation etc...
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout>
      </v-container>

      <v-snackbar
        v-model="snackbar.visible"
        :timeout="snackbar.timeout"
        bottom
        right
      >
        Text copied to clipboard.
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      currentLength: undefined,
      currentType: undefined,
      currentText: undefined,
      snackbar: {
        visible: false,
        timeout: 4000
      }
    };
  },
  methods: {
    generateLipsum() {
      this.currentText = "Lorem ipsum...";
    },
    copyToClipboard() {
      const vm = this;
      this.$copyText(this.currentText).then(function() {
        vm.snackbar.visible = true;
      });
    }
  },
  mounted() {
    this.currentLength = 0;
    this.currentType = "words";
  }
};
</script>
