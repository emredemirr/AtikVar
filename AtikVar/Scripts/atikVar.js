const base_url = "http://localhost:52252/";
$.getJSON(base_url + "/Content/il-bolge.json", function (sonuc) {
    $.each(sonuc, function (index, value) {
        var row = "";
        row += '<option value="' + value.il + '">' + value.il + '</option>';
        $("#il").append(row);
    })
});

$(document).ready(function () {
    $("#il").on("change", function () {
        var il = $(this).val();
        $("#ilce").attr("disabled", false).html("<option value=''>Seçin..</option>");
        $.getJSON(base_url+"/Content/il-ilce.json", function (sonuc) {
            $.each(sonuc, function (index, value) {
                var row = "";
                if (value.il == il) {
                    row += '<option value="' + value.ilce + '">' + value.ilce + '</option>';
                    $("#ilce").append(row);
                }
            });
        });
    });
})
