from rest_framework import serializers


class ResponseSerializer(serializers.Serializer):
    answer = serializers.ChoiceField(choices=["yes"])


class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=4, max_length=128)


class StopCourtingSerializer(serializers.Serializer):
    reason = serializers.CharField(min_length=1, max_length=2000)


class WheresaMessageSerializer(serializers.Serializer):
    message = serializers.CharField(min_length=1, max_length=2000)
