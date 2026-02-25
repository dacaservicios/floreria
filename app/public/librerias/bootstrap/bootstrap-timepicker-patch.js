$(function () {
  // Esperar a que el plugin esté cargado y parcharlo
  var proto = $.fn.timepicker.Constructor.prototype;

  proto.getTime = function () {
    if ("" === this.hour) return "";
    var hour   = this.hour.toString().length   === 1 ? "0" + this.hour   : this.hour;
    var minute = this.minute.toString().length  === 1 ? "0" + this.minute : this.minute;
    var second = this.second.toString().length  === 1 ? "0" + this.second : this.second;
    return hour + ":" + minute +
      (this.showSeconds  ? ":" + second : "") +
      (this.showMeridian ? " " + this.meridian : "");
  };

  proto.updateWidget = function () {
    if (this.$widget === false) return;
    var hour   = this.hour.toString().length   === 1 ? "0" + this.hour   : this.hour;
    var minute = this.minute.toString().length  === 1 ? "0" + this.minute : this.minute;
    var second = this.second.toString().length  === 1 ? "0" + this.second : this.second;
    if (this.showInputs) {
      this.$widget.find("input.bootstrap-timepicker-hour").val(hour);
      this.$widget.find("input.bootstrap-timepicker-minute").val(minute);
      this.showSeconds  && this.$widget.find("input.bootstrap-timepicker-second").val(second);
      this.showMeridian && this.$widget.find("input.bootstrap-timepicker-meridian").val(this.meridian);
    } else {
      this.$widget.find("span.bootstrap-timepicker-hour").text(hour);
      this.$widget.find("span.bootstrap-timepicker-minute").text(minute);
      this.showSeconds  && this.$widget.find("span.bootstrap-timepicker-second").text(second);
      this.showMeridian && this.$widget.find("span.bootstrap-timepicker-meridian").text(this.meridian);
    }
  };

  // Inicializar tu timepicker normalmente
  $('#mi-timepicker').timepicker({
    showSeconds: true,
    showMeridian: false
  });
});