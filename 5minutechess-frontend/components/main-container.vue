<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "mdi-home",
  },
  text: {
    type: String,
    default: "Container Title",
  },
  size: {
    xs: {
      type: Number,
      default: 10,
    },
    sm: {
      type: Number,
      default: 8,
    },
    md: {
      type: Number,
      default: 7,
    },
    lg: {
      type: Number,
      default: 5,
    },
    xl: {
      type: Number,
      default: 4,
    },
  },
});
</script>

<template>
  <v-main>
    <v-row align="center" style="height: 100%">
      <v-col
        cols="12"
        :xs="props.size.xs"
        :sm="props.size.sm"
        :md="props.size.md"
        :lg="props.size.lg"
        :xl="props.size.xl"
        class="container"
      >
        <div class="titleContainer">
          <v-icon left>{{ props.icon }}</v-icon>
          <p class="titleText">{{ props.text }}</p>
          <v-spacer></v-spacer>
        </div>
        <!-- <div class="innerPadding"> -->
        <div class="headCont">
          <slot />
        </div>
        <!-- </div> -->
      </v-col>
    </v-row>
  </v-main>
</template>

<style lang="scss">
.container {
  background-color: #2d2d2d;
  //margin-top: 0;
  margin-left: auto;
  margin-right: auto;
  padding: 0px;
  border-radius: 10px;
  z-index: 5;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.headCont {
  display: flex;
  flex-direction: column;
  min-height: 20vh;
}

.innerPadding {
  padding: 10px;
}

.titleContainer {
  display: flex;
  background: #38a3a5;
  margin: 0;
  margin-right: 0;
  // margin-left: -12px;
  // margin-top: -12px;
  border-radius: 10px 10px 0 0;
  padding: 10px;
  padding-left: 15px;
  padding-bottom: 7px;
  border-bottom: solid 3px #2d2d2d;
}

.titleText {
  margin-left: 10px;
}

.textInputHeading {
  padding-top: 8vh;
}
</style>
