FROM openpolicyagent/opa:0.34.2-rootless

COPY cvat/apps/iam/rules /rules

CMD ["run" ,"--server", "--addr", ":8181", "--set=decision_logs.console=true", "/rules" ]
