import {
  attachmentTypeOptions,
  cabinTypeOptions,
  conditionOptions,
  craneAxleCountOptions,
  craneChassisTypeOptions,
  craneTypeOptions,
  drillTypeOptions,
  driveTypeOptions,
  drumTypeOptions,
  forkliftMastTypeOptions,
  fuelTypeOptions,
  platformTypeOptions,
  powerSourceOptions,
  pumpTypeOptions,
  transpaletTypeOptions,
  walkingSystemOptions,
} from "@/lib/listingFormOptions";

export type CoreFieldKey =
  | "brand"
  | "model"
  | "year"
  | "condition"
  | "working_hours"
  | "capacity_kg"
  | "lift_height_mm"
  | "fuel_type";

export type SpecFieldKey =
  | "crane_type"
  | "crane_chassis_type"
  | "crane_axle_count"
  | "crane_length_m"
  | "crane_tonnage"
  | "criteria_suggestion"
  | "mast_type"
  | "drive_type"
  | "battery_voltage"
  | "attachment_type"
  | "engine_power_hp"
  | "cabin_type"
  | "transpalet_type"
  | "platform_type"
  | "working_height_m"
  | "platform_capacity_kg"
  | "horizontal_reach_m"
  | "power_source"
  | "carrying_capacity_kg"
  | "dig_depth_mm"
  | "loader_bucket_m3"
  | "pump_type"
  | "boom_length_m"
  | "pumping_capacity_m3h"
  | "pipe_diameter_mm"
  | "operating_weight_kg"
  | "bucket_capacity_m3"
  | "walking_system"
  | "drill_type"
  | "drilling_depth_m"
  | "reach_m"
  | "mixer_volume_m3"
  | "drum_type";

export type ListingFieldKey = CoreFieldKey | SpecFieldKey;

export type ListingFieldOption = {
  label: string;
  value: string;
};

export type ListingFieldDefinition = {
  key: ListingFieldKey;
  label: string;
  type: "text" | "number" | "select" | "radio";
  source: "core" | "spec";
  required?: boolean;
  placeholder?: string;
  options?: ListingFieldOption[];
  min?: number;
  max?: number;
  step?: string;
  helperText?: string;
  showWhen?: {
    key: ListingFieldKey;
    equals: string;
  };
};

export type CategoryFormSpec = {
  step1Fields: ListingFieldKey[];
  step2Fields: ListingFieldKey[];
  detailFieldOrder: ListingFieldKey[];
};

const toOptions = (values: readonly string[]): ListingFieldOption[] =>
  values.map((value) => ({ label: value, value }));

const conditionField: ListingFieldDefinition = {
  key: "condition",
  label: "Durum",
  type: "radio",
  source: "core",
  required: true,
  options: [...conditionOptions],
};

const brandField: ListingFieldDefinition = {
  key: "brand",
  label: "Marka",
  type: "text",
  source: "core",
  required: true,
  placeholder: "Marka ara...",
};

const modelField: ListingFieldDefinition = {
  key: "model",
  label: "Model",
  type: "text",
  source: "core",
  required: true,
};

const yearField: ListingFieldDefinition = {
  key: "year",
  label: "Yıl",
  type: "number",
  source: "core",
  required: true,
  min: 1970,
  max: 2026,
};

const workingHoursField: ListingFieldDefinition = {
  key: "working_hours",
  label: "Çalışma Saati",
  type: "number",
  source: "core",
  min: 0,
  showWhen: { key: "condition", equals: "ikinci-el" },
};

const capacityField: ListingFieldDefinition = {
  key: "capacity_kg",
  label: "Kapasite (kg)",
  type: "number",
  source: "core",
  min: 0,
};

const liftHeightField: ListingFieldDefinition = {
  key: "lift_height_mm",
  label: "Kaldırma Yüksekliği (mm)",
  type: "number",
  source: "core",
  min: 0,
};

const fuelTypeField: ListingFieldDefinition = {
  key: "fuel_type",
  label: "Yakıt Tipi",
  type: "radio",
  source: "core",
  required: true,
  options: [...fuelTypeOptions],
};

export const LISTING_FIELD_DEFINITIONS: Record<ListingFieldKey, ListingFieldDefinition> = {
  brand: brandField,
  model: modelField,
  year: yearField,
  condition: conditionField,
  working_hours: workingHoursField,
  capacity_kg: capacityField,
  lift_height_mm: liftHeightField,
  fuel_type: fuelTypeField,
  crane_type: {
    key: "crane_type",
    label: "Vinç Tipi",
    type: "select",
    source: "spec",
    required: true,
    options: toOptions(craneTypeOptions),
  },
  crane_chassis_type: {
    key: "crane_chassis_type",
    label: "Şasi Tipi",
    type: "select",
    source: "spec",
    required: true,
    options: toOptions(craneChassisTypeOptions),
  },
  crane_axle_count: {
    key: "crane_axle_count",
    label: "Dingil Sayısı",
    type: "select",
    source: "spec",
    required: true,
    options: toOptions(craneAxleCountOptions),
  },
  crane_length_m: {
    key: "crane_length_m",
    label: "Uzunluk (m)",
    type: "number",
    source: "spec",
    required: true,
    min: 0,
    step: "0.1",
  },
  crane_tonnage: {
    key: "crane_tonnage",
    label: "Tonaj",
    type: "number",
    source: "spec",
    required: true,
    min: 0,
    step: "0.1",
  },
  criteria_suggestion: {
    key: "criteria_suggestion",
    label: "Kriter Önerin",
    type: "text",
    source: "spec",
    placeholder: "Diğer kriterleri yazın",
  },
  mast_type: {
    key: "mast_type",
    label: "Mast Tipi",
    type: "select",
    source: "spec",
    options: toOptions(forkliftMastTypeOptions),
  },
  drive_type: {
    key: "drive_type",
    label: "Yürüyüş Tipi",
    type: "select",
    source: "spec",
    options: toOptions(driveTypeOptions),
  },
  battery_voltage: {
    key: "battery_voltage",
    label: "Akü Voltajı",
    type: "number",
    source: "spec",
    min: 0,
  },
  attachment_type: {
    key: "attachment_type",
    label: "Ataşman Tipi",
    type: "select",
    source: "spec",
    options: toOptions(attachmentTypeOptions),
  },
  engine_power_hp: {
    key: "engine_power_hp",
    label: "Motor Gücü (hp)",
    type: "number",
    source: "spec",
    min: 0,
  },
  cabin_type: {
    key: "cabin_type",
    label: "Kabin Tipi",
    type: "select",
    source: "spec",
    options: toOptions(cabinTypeOptions),
  },
  transpalet_type: {
    key: "transpalet_type",
    label: "Transpalet Tipi",
    type: "select",
    source: "spec",
    options: toOptions(transpaletTypeOptions),
  },
  platform_type: {
    key: "platform_type",
    label: "Platform Tipi",
    type: "select",
    source: "spec",
    required: true,
    options: toOptions(platformTypeOptions),
  },
  working_height_m: {
    key: "working_height_m",
    label: "Çalışma Yüksekliği (m)",
    type: "number",
    source: "spec",
    required: true,
    min: 0,
    step: "0.1",
  },
  platform_capacity_kg: {
    key: "platform_capacity_kg",
    label: "Platform Kapasitesi (kg)",
    type: "number",
    source: "spec",
    min: 0,
  },
  horizontal_reach_m: {
    key: "horizontal_reach_m",
    label: "Yatay Uzanım (m)",
    type: "number",
    source: "spec",
    min: 0,
    step: "0.1",
  },
  power_source: {
    key: "power_source",
    label: "Güç Kaynağı",
    type: "select",
    source: "spec",
    options: toOptions(powerSourceOptions),
  },
  carrying_capacity_kg: {
    key: "carrying_capacity_kg",
    label: "Taşıma Kapasitesi (kg)",
    type: "number",
    source: "spec",
    min: 0,
  },
  dig_depth_mm: {
    key: "dig_depth_mm",
    label: "Kazı Derinliği (mm)",
    type: "number",
    source: "spec",
    min: 0,
  },
  loader_bucket_m3: {
    key: "loader_bucket_m3",
    label: "Yükleyici Kepçe (m3)",
    type: "number",
    source: "spec",
    min: 0,
    step: "0.1",
  },
  pump_type: {
    key: "pump_type",
    label: "Pompa Tipi",
    type: "select",
    source: "spec",
    options: toOptions(pumpTypeOptions),
  },
  boom_length_m: {
    key: "boom_length_m",
    label: "Bom Uzunluğu (m)",
    type: "number",
    source: "spec",
    required: true,
    min: 0,
    step: "0.1",
  },
  pumping_capacity_m3h: {
    key: "pumping_capacity_m3h",
    label: "Pompa Debisi (m3/s)",
    type: "number",
    source: "spec",
    min: 0,
    step: "0.1",
  },
  pipe_diameter_mm: {
    key: "pipe_diameter_mm",
    label: "Boru Çapı (mm)",
    type: "number",
    source: "spec",
    min: 0,
  },
  operating_weight_kg: {
    key: "operating_weight_kg",
    label: "Çalışma Ağırlığı (kg)",
    type: "number",
    source: "spec",
    min: 0,
  },
  bucket_capacity_m3: {
    key: "bucket_capacity_m3",
    label: "Kepçe Kapasitesi (m3)",
    type: "number",
    source: "spec",
    min: 0,
    step: "0.1",
  },
  walking_system: {
    key: "walking_system",
    label: "Yürüyüş Sistemi",
    type: "select",
    source: "spec",
    options: toOptions(walkingSystemOptions),
  },
  drill_type: {
    key: "drill_type",
    label: "Sondaj Tipi",
    type: "select",
    source: "spec",
    required: true,
    options: toOptions(drillTypeOptions),
  },
  drilling_depth_m: {
    key: "drilling_depth_m",
    label: "Sondaj Derinliği (m)",
    type: "number",
    source: "spec",
    required: true,
    min: 0,
    step: "0.1",
  },
  reach_m: {
    key: "reach_m",
    label: "Uzanım (m)",
    type: "number",
    source: "spec",
    min: 0,
    step: "0.1",
  },
  mixer_volume_m3: {
    key: "mixer_volume_m3",
    label: "Kazan Hacmi (m3)",
    type: "number",
    source: "spec",
    required: true,
    min: 0,
    step: "0.1",
  },
  drum_type: {
    key: "drum_type",
    label: "Kazan Tipi",
    type: "select",
    source: "spec",
    options: toOptions(drumTypeOptions),
  },
};

export const CATEGORY_FORM_SPECS: Record<string, CategoryFormSpec> = {
  forklift: {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "capacity_kg",
      "lift_height_mm",
      "fuel_type",
      "mast_type",
      "drive_type",
      "battery_voltage",
      "attachment_type",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "capacity_kg",
      "lift_height_mm",
      "fuel_type",
      "mast_type",
      "drive_type",
      "battery_voltage",
      "attachment_type",
    ],
  },
  "terminal-cekici": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "drive_type",
      "cabin_type",
      "carrying_capacity_kg",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "drive_type",
      "cabin_type",
      "carrying_capacity_kg",
    ],
  },
  "platformlar-manlift": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "platform_type",
      "working_height_m",
      "platform_capacity_kg",
      "horizontal_reach_m",
      "fuel_type",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "platform_type",
      "working_height_m",
      "platform_capacity_kg",
      "horizontal_reach_m",
      "fuel_type",
    ],
  },
  transpaletler: {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "transpalet_type",
      "power_source",
      "carrying_capacity_kg",
      "lift_height_mm",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "transpalet_type",
      "power_source",
      "carrying_capacity_kg",
      "lift_height_mm",
    ],
  },
  "istif-makineleri": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "capacity_kg",
      "lift_height_mm",
      "mast_type",
      "power_source",
      "attachment_type",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "capacity_kg",
      "lift_height_mm",
      "mast_type",
      "power_source",
      "attachment_type",
    ],
  },
  "beko-loder-kazici-yukleyici": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "dig_depth_mm",
      "loader_bucket_m3",
      "drive_type",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "dig_depth_mm",
      "loader_bucket_m3",
      "drive_type",
    ],
  },
  "beton-pompasi": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "pump_type",
      "boom_length_m",
      "pumping_capacity_m3h",
      "pipe_diameter_mm",
      "crane_axle_count",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "pump_type",
      "boom_length_m",
      "pumping_capacity_m3h",
      "pipe_diameter_mm",
      "crane_axle_count",
    ],
  },
  dozer: {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "bucket_capacity_m3",
      "walking_system",
      "operating_weight_kg",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "bucket_capacity_m3",
      "walking_system",
      "operating_weight_kg",
    ],
  },
  "ekskavator-kepce": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "bucket_capacity_m3",
      "dig_depth_mm",
      "operating_weight_kg",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "bucket_capacity_m3",
      "dig_depth_mm",
      "operating_weight_kg",
    ],
  },
  "loder-yukleyici": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "bucket_capacity_m3",
      "operating_weight_kg",
      "drive_type",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "fuel_type",
      "engine_power_hp",
      "bucket_capacity_m3",
      "operating_weight_kg",
      "drive_type",
    ],
  },
  "mobil-vinc": {
    step1Fields: [],
    step2Fields: [
      "crane_type",
      "brand",
      "model",
      "year",
      "condition",
      "crane_chassis_type",
      "crane_axle_count",
      "crane_length_m",
      "crane_tonnage",
      "criteria_suggestion",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "crane_type",
      "brand",
      "model",
      "crane_chassis_type",
      "crane_axle_count",
      "crane_length_m",
      "crane_tonnage",
      "criteria_suggestion",
    ],
  },
  "sondaj-makinesi": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "drill_type",
      "drilling_depth_m",
      "engine_power_hp",
      "fuel_type",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "drill_type",
      "drilling_depth_m",
      "engine_power_hp",
      "fuel_type",
    ],
  },
  "teleskopik-yukleyici": {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "capacity_kg",
      "lift_height_mm",
      "reach_m",
      "fuel_type",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "capacity_kg",
      "lift_height_mm",
      "reach_m",
      "fuel_type",
    ],
  },
  transmikser: {
    step1Fields: ["brand", "model", "year", "condition"],
    step2Fields: [
      "working_hours",
      "mixer_volume_m3",
      "crane_axle_count",
      "drum_type",
      "engine_power_hp",
      "fuel_type",
    ],
    detailFieldOrder: [
      "year",
      "condition",
      "working_hours",
      "mixer_volume_m3",
      "crane_axle_count",
      "drum_type",
      "engine_power_hp",
      "fuel_type",
    ],
  },
};

export const DEFAULT_CATEGORY_SPEC: CategoryFormSpec = {
  step1Fields: ["brand", "model", "year", "condition"],
  step2Fields: ["working_hours", "capacity_kg", "lift_height_mm", "fuel_type"],
  detailFieldOrder: [
    "year",
    "condition",
    "working_hours",
    "capacity_kg",
    "lift_height_mm",
    "fuel_type",
  ],
};

export function getCategoryFormSpec(category: string | null | undefined): CategoryFormSpec {
  if (!category) return DEFAULT_CATEGORY_SPEC;
  return CATEGORY_FORM_SPECS[category] ?? DEFAULT_CATEGORY_SPEC;
}

export function getFieldDefinition(key: ListingFieldKey) {
  return LISTING_FIELD_DEFINITIONS[key];
}

export function formatFieldValue(key: ListingFieldKey, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "-";
    }
  }

  const field = getFieldDefinition(key);
  if (!field) {
    return String(value);
  }
  if ((field.type === "select" || field.type === "radio") && typeof value === "string") {
    return field.options?.find((option) => option.value === value)?.label ?? value;
  }

  return String(value);
}
