<template>
  <v-app>
    <v-toolbar app flat>
      <v-toolbar-title class="mr-4">
        <Logo />
      </v-toolbar-title>
      <!-- Length slider -->
      <v-flex xs2 class="mr-5">
        <v-input hide-details>
          <v-slider
            class="mr-3 v-label--alt"
            v-model="lipsum.options.length"
            hide-details
            :min="1"
            label="Length"
          ></v-slider>
          <slot name="append">
            <v-label>{{ lipsum.options.length }}</v-label>
          </slot>
        </v-input>
      </v-flex>
      <!-- Type select -->
      <v-flex xs2 class="mr-4">
        <v-input class="v-label--alt" label="Type" hide-details>
          <v-select
            v-model="lipsum.options.type"
            hide-details
            solo
            flat
            background-color="transparent"
            :items="['words', 'sentences', 'paragraphs']"
          ></v-select>
        </v-input>
      </v-flex>
      <!-- Begin with 'Lorem ipsum' select -->
      <v-checkbox
        v-model="lipsum.options.prependLoremIpsum"
        hide-details
        class="pt-0"
        color="primary"
        label="Begin text with 'Lorem ipsum...'"
      ></v-checkbox>
      <!-- Actions -->
      <v-toolbar-items>
        <v-btn flat @click="generateLipsum()"
          ><i class="v-icon v-icon--left"> <icon-refresh /> </i
          ><span>Generate</span></v-btn
        >
        <v-btn
          flat
          :disabled="lipsum.current.text.length <= 1"
          @click="copyToClipboard()"
          ><i class="v-icon v-icon--left"> <icon-clipboard /> </i
          ><span>Copy</span></v-btn
        >
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout fill-height>
          <v-spacer />
          <v-flex md5 class="generator">
            <v-textarea
              v-model="lipsum.current.text"
              hide-details
              auto-grow
              flat
              solo
              readonly
            ></v-textarea>
          </v-flex>
          <v-spacer />
          <v-flex md3 class="aside mt-5 mb-5">
            <Logo
              is-light
              class="mt-2 mb-2"
              style="width: 118px; height: 64px"
            />
            <div class="aside-intro mt-4 mb-4 pb-2">
              <p>
                Lipsy is a tool for quickly generating tailored placeholder text
                for your design project.
              </p>
            </div>
            <v-layout class="aside-stats mt-4 mb-4">
              <v-flex>
                <dd>{{ lipsum.current.count.characters }}</dd>
                <dt>characters</dt>
              </v-flex>
              <v-flex>
                <dd>{{ lipsum.current.count.words }}</dd>
                <dt>words</dt>
              </v-flex>
              <v-flex>
                <dd>{{ lipsum.current.count.sentences }}</dd>
                <dt>sentences</dt>
              </v-flex>
              <v-flex>
                <dd>{{ lipsum.current.count.paragraphs }}</dd>
                <dt>paragraphs</dt>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-spacer />
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
import dictionary from "@/json/dictionary";
import _sampleSize from "lodash/sampleSize";
import _upperFirst from "lodash/upperFirst";
import _random from "lodash/random";
import { TweenLite } from "gsap";
import Logo from "@/components/Logo";
export default {
  name: "App",
  components: {
    Logo
  },
  data() {
    return {
      lipsum: {
        current: {
          text: new String(),
          count: {
            // Cloned values from computed properties which are tweened by GSAP
            characters: new Number(),
            words: new Number(),
            sentences: new Number(),
            paragraphs: new Number()
          }
        },
        options: {
          length: undefined,
          type: undefined,
          prependLoremIpsum: false
        }
      },
      snackbar: {
        visible: false,
        timeout: 4000
      }
    };
  },
  computed: {
    // Raw character/word counts from generated lipsum
    characterCount() {
      return this.lipsum.current.text.length;
    },
    wordCount() {
      return this.lipsum.current.text.split(" ").length;
    },
    sentenceCount() {
      return this.lipsum.current.text.split(".").length - 1;
    },
    paragraphCount() {
      return this.lipsum.current.text.split("\n\n").length;
    }
  },
  methods: {
    generateLipsum() {
      let lipsum = new String();

      // Generate random sample from dictionary and delimit with space
      const generateSentence = words =>
        _sampleSize(dictionary.words, words).join(" ");

      // Optional lorem ipsum to be prepended
      const prepend = "Lorem ipsum quia dolor sit amet";

      // Generate words
      if (this.lipsum.options.type === "words") {
        if (this.lipsum.options.prependLoremIpsum) {
          lipsum = _upperFirst(
            prepend + " " + generateSentence(this.lipsum.options.length) + "."
          );
        } else {
          lipsum = _upperFirst(
            generateSentence(this.lipsum.options.length) + "."
          );
        }
        // Generate sentences
      } else if (this.lipsum.options.type === "sentences") {
        for (let i = 0; i < this.lipsum.options.length; i++) {
          if (this.lipsum.options.prependLoremIpsum && i == 0) {
            lipsum =
              lipsum +
              _upperFirst(
                prepend + " " + generateSentence(_random(12, 20)) + ". "
              );
          } else {
            lipsum =
              lipsum + _upperFirst(generateSentence(_random(12, 20)) + ". ");
          }
        }
        // Generate paragraphs
      } else if (this.lipsum.options.type === "paragraphs") {
        for (let x = 0; x < this.lipsum.options.length; x++) {
          for (let y = 0; y < _random(2, 5); y++) {
            if (this.lipsum.options.prependLoremIpsum && x == 0) {
              lipsum =
                lipsum +
                _upperFirst(
                  prepend + " " + generateSentence(_random(12, 20)) + ". "
                );
            } else {
              lipsum =
                lipsum + _upperFirst(generateSentence(_random(12, 20)) + ". ");
            }
          }

          // Add two line breaks after all but the last paragraph
          lipsum =
            x < this.lipsum.options.length - 1 ? lipsum + "\n\n" : lipsum;
        }
      }

      // Set generated lipsum
      return (this.lipsum.current.text = lipsum);
    },
    copyToClipboard() {
      const vm = this;
      this.$copyText(this.lipsum.current.text).then(function() {
        vm.snackbar.visible = true;
      });
    },
    tweenValues(value, type) {
      TweenLite.to(this.$data.lipsum.current.count, 0.5, {
        [type]: value,
        roundProps: type
      });
    }
  },
  watch: {
    characterCount(newValue) {
      this.tweenValues(newValue, "characters");
    },
    wordCount(newValue) {
      this.tweenValues(newValue, "words");
    },
    sentenceCount(newValue) {
      this.tweenValues(newValue, "sentences");
    },
    paragraphCount(newValue) {
      this.tweenValues(newValue, "paragraphs");
    }
  },
  mounted() {
    // Set initial options
    this.lipsum.options = {
      type: "sentences",
      length: 4
    };
  }
};
</script>

<style lang="stylus">
@require 'stylus/_variables'
@require '~vuetify/src/stylus/settings/_variables.styl'

.container
  position: relative
  padding: 3rem
  height: calc(100vh - 64px)

.aside
  color: $shades.white

  &-intro
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: -0.035rem;
    border-bottom: 1px solid $shades.white;

  dd,
  dt
    letter-spacing: -0.015rem;

  dd
    font-weight: 700
    font-size: 2.5rem
    line-height: 1.2

.logo
  .v-toolbar &
    width: auto;
    height: 30px

.v
  &-content
    background-image: linear-gradient(158deg, $colours.secondary, $colours.primary)

  &-toolbar
    &__title
      display: flex;

  &-btn
  &-label
  &-select__selection
  &-list__tile
    letter-spacing: -0.015em

  &-btn
    font-size: 16px
    text-transform: none

  &-input.v-label--alt,
  &-label--alt
    label
      height: 75%
      font-size: @height
      line-height: @height
      font-weight: 700
      letter-spacing: .15rem
      text-transform: uppercase
      color: $grey.lighten-1

  // Force text area to be full-height
  &-textarea
    &
    *
      height: 100% !important

    .v-input__slot
      padding: 0 !important;

    .v-text-field__slot
      margin: 0 !important;

    textarea
      padding: 2rem !important
      margin: 0 !important
      font-size: 1.25rem
      letter-spacing: -0.025rem
      line-height: 1.65
      overflow-y: auto

  &-icon svg
    stroke: $colours.primary
</style>
