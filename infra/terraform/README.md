# Cloud Notes - Terraform Infrastructure

Este diretório contém a infraestrutura como código (IaC) para o projeto Cloud Notes usando Terraform.

## 📦 Recursos Provisionados

- **AWS Cognito User Pool**: Autenticação de usuários
  - Login com email/senha (sem verificação)
  - Login social (Google, GitHub)
  - JWT tokens
- **AWS DynamoDB**: Banco de dados NoSQL
  - Tabela `notes` para armazenar notas
  - GSI para filtros por status

## 🚀 Pré-requisitos

1. **Terraform instalado** (>= 1.0)

   ```bash
   # Verificar instalação
   terraform version
   ```

2. **AWS CLI configurado**

   ```bash
   aws configure
   # Fornecer: Access Key ID, Secret Access Key, Region (us-east-1)
   ```

3. **Credenciais OAuth**
   - Google: https://console.cloud.google.com/apis/credentials
   - GitHub: https://github.com/settings/developers

## 📝 Configuração

### 1. Criar arquivo de variáveis

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
```

### 2. Editar `terraform.tfvars`

```hcl
google_client_id     = "seu-client-id.apps.googleusercontent.com"
google_client_secret = "seu-client-secret"
github_client_id     = "seu-github-client-id"
github_client_secret = "seu-github-client-secret"
```

### 3. Configurar Google OAuth

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Criar projeto (se não tiver)
3. Criar credenciais OAuth 2.0
4. Adicionar URIs de redirecionamento autorizados:
   ```
   https://cloud-notes-dev-XXXXXXXX.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
   (Substitua XXXXXXXX pelo domain suffix após o apply)

### 4. Configurar GitHub OAuth

1. Acesse: https://github.com/settings/developers
2. New OAuth App
3. Preencher:
   - Application name: `Cloud Notes Dev`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL:
     ```
     https://cloud-notes-dev-XXXXXXXX.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
     ```

## 🏗️ Comandos

### Inicializar Terraform

```bash
terraform init
```

### Planejar mudanças

```bash
terraform plan -out=tfplan
```

### Aplicar infraestrutura

```bash
terraform apply tfplan
```

### Ver outputs

```bash
terraform output
```

### Destruir recursos

```bash
terraform destroy
```

## 📤 Outputs

Após o `terraform apply`, você receberá:

```
cognito_user_pool_id    = "us-east-1_XXXXXXXXX"
cognito_client_id       = "XXXXXXXXXXXXXXXXXXXXXXXXXX"
cognito_domain          = "cloud-notes-dev-XXXXXXXX"
cognito_hosted_ui_url   = "https://cloud-notes-dev-XXXXXXXX.auth.us-east-1.amazoncognito.com"
dynamodb_notes_table_name = "cloud-notes-dev-notes"
aws_region              = "us-east-1"
```

### Copiar para .env do backend

```bash
# apps/api/.env
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_COGNITO_REGION=us-east-1
AWS_COGNITO_DOMAIN=cloud-notes-dev-XXXXXXXX
DYNAMODB_TABLE_NOTES=cloud-notes-dev-notes
```

## 💰 Custos

Todos os recursos estão no **Free Tier**:

- Cognito: 50.000 MAUs gratuitos
- DynamoDB: 25 GB + 25 WCU/RCU gratuitos
- Sem custos de email (verificação desabilitada)
- Sem custos de SMS (MFA desabilitado)

## 🔒 Segurança

- Nunca commitar `terraform.tfvars` (já está no .gitignore)
- Nunca commitar credenciais OAuth
- Usar variáveis de ambiente para secrets em produção

## 📚 Estrutura

```
terraform/
├── main.tf                    # Configuração principal
├── providers.tf               # Providers AWS
├── variables.tf               # Definição de variáveis
├── outputs.tf                 # Outputs
├── cognito.tf                 # Cognito User Pool + OAuth
├── dynamodb.tf                # DynamoDB Tables
├── terraform.tfvars.example   # Exemplo de variáveis
└── .gitignore                 # Ignorar arquivos sensíveis
```

## 🐛 Troubleshooting

### Erro: "domain already exists"

O domínio do Cognito precisa ser único globalmente. O Terraform adiciona um sufixo aleatório automaticamente.

### Erro: "OAuth provider not found"

Certifique-se de que as credenciais OAuth estão corretas no `terraform.tfvars`.

### Erro: AWS credentials

```bash
aws configure
# ou
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx
```
