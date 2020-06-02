<template>
  <div class="es-form-array-table">
    <table class="es-table">
      <thead>
        <th
          class="es-order-fixed"
          v-if="schema.array.hasOrder !== false"
          :style="{ padding: schema.ui.rowSpace / 2 + 'px' }"
        >
          序号
        </th>
        <th
          v-for="(headerSchema, headerFieldName) in schema.properties"
          :key="headerFieldName"
          :class="['es-col-' + headerSchema.col]"
          :style="{ padding: schema.ui.rowSpace / 2 + 'px' }"
        >
          <div
            :class="[
              'es-form-table-head',
              headerSchema.label && headerSchema.label.align
                ? 'es-form-component-' + headerSchema.label.align
                : ''
            ]"
          >
            <span
              v-if="
                schema.array.headRequired &&
                  headerSchema.rules &&
                  headerSchema.rules.required &&
                  headerSchema.rules.showRequired
              "
              class="es-required"
              >*</span
            >
            <!-- headerSchema.label.hidden为true: 也补充key -->
            <template v-if="headerSchema.label && !headerSchema.label.hidden">
              <span v-if="!headerSchema.label.name">
                {{
                  headerSchema.label.text
                    ? headerSchema.label.text
                    : headerFieldName + ""
                }}
              </span>
              <span v-else class="es-form-label-box">
                <es-base
                  :config="headerSchema.label"
                  :info="headerSchema.__info"
                ></es-base>
              </span>
              <span
                class="es-form-label-help"
                v-if="
                  headerSchema.label.help && !headerSchema.label.help.hidden
                "
              >
                <es-base
                  :config="headerSchema.label.help"
                  :info="headerSchema.__info"
                ></es-base>
              </span>
            </template>
            <template v-else>
              {{ headerFieldName + "" }}
            </template>
            <!-- <span
              v-if="headerSchema.help && !schema.help.hidden"
              class="es-form-help"
            >
              <es-base
                :config="headerSchema.help"
                :info="headerSchema.__info"
              ></es-base>
            </span> -->
          </div>
        </th>
        <th
          class="es-btn-fixed"
          v-if="schema.array.hasDelete || schema.array.hasSort"
          :style="{ padding: schema.ui.rowSpace / 2 + 'px' }"
        >
          操作
        </th>
      </thead>
      <tbody>
        <tr v-for="(itemSchema, index) in schema.__propSchemaList" :key="index">
          <td
            v-if="schema.array.hasOrder !== false"
            :style="{ padding: schema.array.rowSpace / 2 + 'px' }"
          >
            <span
              class="es-order-txt"
              :style="{
                height: schema.ui.rowHeight + 'px',
                lineHeight: schema.ui.rowHeight + 'px'
              }"
              >{{ index + 1 }}.</span
            >
          </td>
          <td
            v-for="(fieldSchema, fieldName) in itemSchema.properties"
            :key="fieldName"
            :style="{
              padding: schema.array.rowSpace / 2 + 'px',
              textAlign: fieldSchema.label.align
            }"
          >
            <es-object-table
              :schema="fieldSchema"
              :has-required="!schema.array.headRequired"
            >
              <slot
                :name="fieldName"
                :schema="fieldSchema"
                :index="index"
              ></slot>
            </es-object-table>
          </td>
          <td
            v-if="
              schema.array.hasDelete ||
                schema.array.hasSort ||
                schema.array.hasCopy
            "
            :style="{ padding: schema.array.rowSpace / 2 + 'px' }"
          >
            <div
              class="es-btn-box"
              :style="{ height: schema.ui.rowHeight + 'px' }"
            >
              <edit-btns
                :has-delete="schema.array.hasDelete"
                :has-sort="schema.array.hasSort"
                :can-delete="schema.__propSchemaList.length > schema.array.min"
                :fixed="schema.array.fixed"
                :is-first="index == 0"
                :is-last="index == schema.__propSchemaList.length - 1"
                :index="index"
                :has-del-warn="schema.array.hasDelWarn"
                :can-add="
                  schema.array.max <= 0 ||
                    schema.__propSchemaList.length < schema.array.max
                "
                :del-msg="schema.array.delMsg"
                :has-add="schema.array.hasCopy"
                @copyItem="copyItem"
                @delItem="delItem"
                @upItem="upItem"
                @downItem="downItem"
              ></edit-btns>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="schema.array.hasDelete || schema.array.hasAdd">
        <tr>
          <td
            colspan="100%"
            :style="{ padding: schema.array.rowSpace / 2 + 'px' }"
          >
            <edit-bottom-btns
              :has-delete="
                schema.array.hasDelete &&
                  schema.array.min <= 0 &&
                  schema.array.fixed <= 0
              "
              :has-add="schema.array.hasAdd"
              :can-delete="
                schema.__propSchemaList.length > 0 &&
                  schema.array.fixed <= 0 &&
                  schema.array.min <= 0
              "
              :del-msg="schema.array.delAllMsg"
              :index="-1"
              :has-del-warn="schema.array.hasDelWarn"
              :can-add="
                schema.array.max <= 0 ||
                  schema.__propSchemaList.length < schema.array.max
              "
              @delItem="delAllItems"
              @addItem="addItem"
            ></edit-bottom-btns>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang="scss">
@import "../static/css/mixins.scss";
.es-form-array-table {
  .es-table {
    width: 100%;
    max-width: 100%;
    background-color: transparent;
    border-collapse: separate;
    border-spacing: 0px;
    border-radius: 4px;
    // overflow: hidden;
    border: 1px solid #e6ebf5;
    // table-layout: fixed;
    .thead {
      margin: 0;
      padding: 0;
    }
    td,
    th {
      text-align: center;
      padding: 10px;
      vertical-align: top;
      border-top: 1px solid #e6ebf5;
      border-right: 1px solid #e6ebf5;
      white-space: nowrap;
      &:last-child {
        border-right: none;
      }
    }
    th {
      border-top: none;
    }

    tfoot tr:last-child td {
      border-bottom: none;
    }

    .es-order-fixed {
      width: 40px;
    }
    .es-order-txt {
      // line-height: 40px;
      display: block;
    }

    .es-form-table-head {
      @include display-center;
    }

    .es-table-required {
      display: block;
      margin-right: 5px;
    }

    .es-form-table-content {
      @include display-flex;
      @include direction-h;
    }

    .es-btn-box {
      // @include flex-fixed;
      @include display-center;
    }
  }
}
</style>

<script>
import esObjectTable from "./object-table";
import itemMixin from "../mixins/item-mixin";
import arrayMixins from "../mixins/array-mixin.js";
import editBtns from "../components/edit-btns";
import editBottomBtns from "../components/edit-bottom-btns";
import esBase from "../base";

export default {
  mixins: [itemMixin, arrayMixins],
  components: {
    esBase,
    esObjectTable,
    editBtns,
    editBottomBtns
  },
  methods: {}
};
</script>
